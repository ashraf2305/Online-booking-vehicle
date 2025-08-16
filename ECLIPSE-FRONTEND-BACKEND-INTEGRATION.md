# Frontend-Backend Integration in Eclipse IDE - Step by Step Guide

This comprehensive guide walks you through integrating the React frontend with Spring Boot microservices backend in Eclipse IDE.

## 📋 Prerequisites

### Required Software
- **Eclipse IDE for Enterprise Java and Web Developers** (2023-12 or later)
- **Java JDK 17+**
- **Node.js 18+** and **npm**
- **MySQL 8.0** (or use H2 for development)
- **Spring Tools 4** plugin for Eclipse
- **Git** (optional but recommended)

### Project Structure Overview
```
vehicle-booking-system/
├── frontend/                    # React application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── eureka-server/              # Service Discovery
├── user-service/              # User Management Microservice
├── vehicle-service/           # Vehicle Management Microservice
├── api-gateway/              # API Gateway
└── docker-compose.yml        # Container orchestration
```

## 🚀 Phase 1: Backend Setup in Eclipse

### Step 1: Import Backend Projects

1. **Open Eclipse IDE**
   - Launch Eclipse with a new workspace: `C:\workspace\vehicle-booking-integration`

2. **Import Maven Projects**
   ```
   File → Import → Maven → Existing Maven Projects
   ```
   - Browse to your project root directory
   - Select all four backend projects:
     - ✅ eureka-server
     - ✅ user-service  
     - ✅ vehicle-service
     - ✅ api-gateway
   - Click **Finish**

3. **Verify Project Import**
   - Check Project Explorer shows all 4 projects
   - Ensure no compilation errors (red X marks)
   - Wait for Maven dependencies to download

### Step 2: Configure Database Connection

1. **Update Database Credentials**
   
   **For user-service/src/main/resources/application.yml:**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/userdb
       username: YOUR_MYSQL_USERNAME
       password: YOUR_MYSQL_PASSWORD
   ```

   **For vehicle-service/src/main/resources/application.yml:**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/vehicledb
       username: YOUR_MYSQL_USERNAME  
       password: YOUR_MYSQL_PASSWORD
   ```

2. **Create Databases**
   ```sql
   CREATE DATABASE userdb;
   CREATE DATABASE vehicledb;
   ```

### Step 3: Start Backend Services

**CRITICAL: Start services in this exact order!**

1. **Start Eureka Server (Port 8761)**
   ```
   Right-click eureka-server → Run As → Spring Boot App
   ```
   - Wait for: `"Started EurekaServerApplication"`
   - Verify: http://localhost:8761

2. **Start User Service (Port 8081)**
   ```
   Right-click user-service → Run As → Spring Boot App
   ```
   - Wait for: `"Started UserServiceApplication"`
   - Check Eureka: USER-SERVICE should appear

3. **Start Vehicle Service (Port 8082)**
   ```
   Right-click vehicle-service → Run As → Spring Boot App
   ```
   - Wait for: `"Started VehicleServiceApplication"`
   - Check Eureka: VEHICLE-SERVICE should appear

4. **Start API Gateway (Port 8080)**
   ```
   Right-click api-gateway → Run As → Spring Boot App
   ```
   - Wait for: `"Started ApiGatewayApplication"`
   - Check Eureka: API-GATEWAY should appear

### Step 4: Verify Backend Integration

1. **Check Service Registration**
   - Open: http://localhost:8761
   - Should show all 4 services registered

2. **Test API Gateway**
   ```bash
   curl http://localhost:8080/actuator/health
   # Expected: {"status":"UP"}
   ```

3. **Test Direct Services**
   ```bash
   curl http://localhost:8081/user-service/actuator/health
   curl http://localhost:8082/vehicle-service/actuator/health
   ```

## 🎨 Phase 2: Frontend Setup in Eclipse

### Step 5: Import Frontend Project

1. **Import React Project**
   ```
   File → Import → General → Existing Projects into Workspace
   ```
   - Select root directory: `your-project-root`
   - Check: ✅ Copy projects into workspace
   - Click **Finish**

2. **Alternative: Create New Frontend Project**
   ```bash
   # In Eclipse Terminal or External Terminal
   cd /path/to/your/workspace
   npm create vite@latest frontend -- --template react
   cd frontend
   npm install
   ```

### Step 6: Configure Frontend Dependencies

1. **Install Required Dependencies**
   ```bash
   # Navigate to frontend directory in Eclipse Terminal
   npm install lucide-react
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure Tailwind CSS**
   
   **Update tailwind.config.js:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

   **Update src/index.css:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Step 7: Configure API Integration

1. **Create API Configuration**
   
   **Create src/config/api.js:**
   ```javascript
   // API Configuration
   const API_CONFIG = {
     BASE_URL: 'http://localhost:8080', // API Gateway
     USER_SERVICE_DIRECT: 'http://localhost:8081/user-service',
     VEHICLE_SERVICE_DIRECT: 'http://localhost:8082/vehicle-service',
     TIMEOUT: 10000
   };

   export default API_CONFIG;
   ```

2. **Create API Service Layer**
   
   **Create src/services/apiService.js:**
   ```javascript
   import API_CONFIG from '../config/api';

   class ApiService {
     constructor() {
       this.baseURL = API_CONFIG.BASE_URL;
       this.token = localStorage.getItem('auth_token');
     }

     setAuthToken(token) {
       this.token = token;
       localStorage.setItem('auth_token', token);
     }

     clearAuthToken() {
       this.token = null;
       localStorage.removeItem('auth_token');
     }

     async request(endpoint, options = {}) {
       const url = `${this.baseURL}${endpoint}`;
       const config = {
         headers: {
           'Content-Type': 'application/json',
           ...(this.token && { Authorization: `Bearer ${this.token}` }),
           ...options.headers,
         },
         ...options,
       };

       try {
         const response = await fetch(url, config);
         
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }
         
         return await response.json();
       } catch (error) {
         console.error('API request failed:', error);
         throw error;
       }
     }

     // Authentication APIs
     async login(credentials) {
       return this.request('/api/auth/login', {
         method: 'POST',
         body: JSON.stringify(credentials),
       });
     }

     async register(userData) {
       return this.request('/api/users/register', {
         method: 'POST',
         body: JSON.stringify(userData),
       });
     }

     // User APIs
     async getUsers() {
       return this.request('/api/users');
     }

     async approveUser(userId) {
       return this.request(`/api/users/${userId}/approve`, {
         method: 'PUT',
       });
     }

     // Vehicle APIs
     async getVehicles() {
       return this.request('/api/vehicles');
     }

     async createVehicle(vehicleData) {
       return this.request('/api/vehicles', {
         method: 'POST',
         body: JSON.stringify(vehicleData),
       });
     }

     // Booking APIs
     async createBooking(bookingData) {
       return this.request('/api/bookings', {
         method: 'POST',
         body: JSON.stringify(bookingData),
       });
     }

     async getCustomerBookings(customerId) {
       return this.request(`/api/bookings/customer/${customerId}`);
     }
   }

   export default new ApiService();
   ```

## 🔗 Phase 3: Integration Implementation

### Step 8: Update Context for API Integration

1. **Modify src/context/AppContext.jsx:**
   ```javascript
   import React, { createContext, useContext, useReducer, useEffect } from 'react';
   import apiService from '../services/apiService';

   // ... existing code ...

   export function AppProvider({ children }) {
     const [state, dispatch] = useReducer(appReducer, initialState);

     // Load authentication token on app start
     useEffect(() => {
       const token = localStorage.getItem('auth_token');
       if (token) {
         apiService.setAuthToken(token);
         // Optionally validate token with backend
         validateToken(token);
       }
     }, []);

     const validateToken = async (token) => {
       try {
         const response = await apiService.request('/api/auth/validate', {
           method: 'POST',
           headers: { Authorization: `Bearer ${token}` }
         });
         
         if (response.valid) {
           dispatch({ type: 'SET_CURRENT_USER', payload: response.user });
         } else {
           apiService.clearAuthToken();
         }
       } catch (error) {
         console.error('Token validation failed:', error);
         apiService.clearAuthToken();
       }
     };

     return (
       <AppContext.Provider value={{ state, dispatch, apiService }}>
         {children}
       </AppContext.Provider>
     );
   }
   ```

### Step 9: Update Login Component

1. **Modify src/components/Auth/Login.jsx:**
   ```javascript
   import React, { useState } from 'react';
   import { LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
   import { useApp } from '../../context/AppContext';

   export function Login() {
     const { dispatch, apiService } = useApp();
     const [isLogin, setIsLogin] = useState(true);
     const [loading, setLoading] = useState(false);
     const [formData, setFormData] = useState({
       userId: '',
       password: '',
       role: 'CUSTOMER'
     });
     const [error, setError] = useState('');

     const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');
       setLoading(true);

       try {
         if (isLogin) {
           // Login via API
           const response = await apiService.login({
             userId: formData.userId,
             password: formData.password
           });

           if (response.token) {
             apiService.setAuthToken(response.token);
             dispatch({ type: 'SET_CURRENT_USER', payload: response.user });
           }
         } else {
           // Registration via API
           await apiService.register({
             userId: formData.userId,
             password: formData.password,
             role: formData.role
           });

           alert('Registration successful! Please wait for admin approval.');
           setIsLogin(true);
           setFormData({ userId: '', password: '', role: 'CUSTOMER' });
         }
       } catch (error) {
         console.error('Authentication error:', error);
         setError(error.message || 'Authentication failed');
       } finally {
         setLoading(false);
       }
     };

     // ... rest of component remains the same ...
   }
   ```

### Step 10: Update Admin Dashboard

1. **Modify src/components/Admin/AdminDashboard.jsx:**
   ```javascript
   import React, { useState, useEffect } from 'react';
   import { useApp } from '../../context/AppContext';

   export function AdminDashboard() {
     const { state, dispatch, apiService } = useApp();
     const [loading, setLoading] = useState(false);
     const [users, setUsers] = useState([]);
     const [vehicles, setVehicles] = useState([]);

     // Load data from backend on component mount
     useEffect(() => {
       loadData();
     }, []);

     const loadData = async () => {
       setLoading(true);
       try {
         const [usersData, vehiclesData] = await Promise.all([
           apiService.getUsers(),
           apiService.getVehicles()
         ]);
         
         setUsers(usersData);
         setVehicles(vehiclesData);
       } catch (error) {
         console.error('Failed to load data:', error);
       } finally {
         setLoading(false);
       }
     };

     const handleUserApproval = async (userId, action) => {
       try {
         if (action === 'approve') {
           await apiService.approveUser(userId);
         } else {
           await apiService.rejectUser(userId);
         }
         
         // Reload users data
         const updatedUsers = await apiService.getUsers();
         setUsers(updatedUsers);
       } catch (error) {
         console.error('User approval failed:', error);
       }
     };

     // ... rest of component logic ...
   }
   ```

## 🧪 Phase 4: Testing Integration

### Step 11: Test Frontend-Backend Communication

1. **Start Frontend Development Server**
   ```bash
   # In Eclipse Terminal, navigate to frontend directory
   npm run dev
   ```
   - Frontend should start on: http://localhost:5173

2. **Test Authentication Flow**
   - Open: http://localhost:5173
   - Try login with: `admin` / `admin123`
   - Check browser Network tab for API calls
   - Verify JWT token storage in localStorage

3. **Test CORS Configuration**
   - If you get CORS errors, add to backend services:
   ```java
   @CrossOrigin(origins = "http://localhost:5173")
   ```

### Step 12: Debug Common Integration Issues

1. **Backend Not Responding**
   ```bash
   # Check if services are running
   curl http://localhost:8080/actuator/health
   curl http://localhost:8081/user-service/actuator/health
   curl http://localhost:8082/vehicle-service/actuator/health
   ```

2. **Frontend API Calls Failing**
   - Check browser Console for errors
   - Verify API endpoints in Network tab
   - Ensure correct ports and context paths

3. **Authentication Issues**
   - Check JWT token format
   - Verify token expiration
   - Ensure proper Authorization headers

### Step 13: Production Build Setup

1. **Configure Production API URLs**
   
   **Create src/config/environment.js:**
   ```javascript
   const config = {
     development: {
       API_BASE_URL: 'http://localhost:8080',
     },
     production: {
       API_BASE_URL: 'https://your-production-api.com',
     }
   };

   const environment = process.env.NODE_ENV || 'development';
   export default config[environment];
   ```

2. **Build Frontend for Production**
   ```bash
   npm run build
   ```

3. **Serve Built Files**
   ```bash
   npm run preview
   ```

## 🚀 Phase 5: Advanced Integration Features

### Step 14: Implement Real-time Updates

1. **Add WebSocket Support (Optional)**
   ```javascript
   // src/services/websocketService.js
   class WebSocketService {
     constructor() {
       this.ws = null;
       this.listeners = new Map();
     }

     connect() {
       this.ws = new WebSocket('ws://localhost:8080/ws');
       
       this.ws.onmessage = (event) => {
         const data = JSON.parse(event.data);
         this.notifyListeners(data.type, data.payload);
       };
     }

     subscribe(eventType, callback) {
       if (!this.listeners.has(eventType)) {
         this.listeners.set(eventType, []);
       }
       this.listeners.get(eventType).push(callback);
     }

     notifyListeners(eventType, data) {
       const callbacks = this.listeners.get(eventType) || [];
       callbacks.forEach(callback => callback(data));
     }
   }

   export default new WebSocketService();
   ```

### Step 15: Add Error Handling & Loading States

1. **Create Error Boundary Component**
   ```javascript
   // src/components/ErrorBoundary.jsx
   import React from 'react';

   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false, error: null };
     }

     static getDerivedStateFromError(error) {
       return { hasError: true, error };
     }

     componentDidCatch(error, errorInfo) {
       console.error('Error caught by boundary:', error, errorInfo);
     }

     render() {
       if (this.state.hasError) {
         return (
           <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <div className="text-center">
               <h1 className="text-2xl font-bold text-red-600 mb-4">
                 Something went wrong
               </h1>
               <p className="text-gray-600 mb-4">
                 {this.state.error?.message}
               </p>
               <button
                 onClick={() => window.location.reload()}
                 className="bg-blue-600 text-white px-4 py-2 rounded"
               >
                 Reload Page
               </button>
             </div>
           </div>
         );
       }

       return this.props.children;
     }
   }

   export default ErrorBoundary;
   ```

2. **Add Loading Component**
   ```javascript
   // src/components/Loading.jsx
   import React from 'react';

   export function Loading({ message = 'Loading...' }) {
     return (
       <div className="flex items-center justify-center p-8">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
         <span className="ml-3 text-gray-600">{message}</span>
       </div>
     );
   }
   ```

## 📊 Phase 6: Monitoring & Debugging

### Step 16: Add Development Tools

1. **Install React Developer Tools**
   - Browser extension for React debugging

2. **Add API Request Logging**
   ```javascript
   // src/services/apiService.js - Add to request method
   async request(endpoint, options = {}) {
     console.log(`🚀 API Request: ${options.method || 'GET'} ${endpoint}`);
     
     try {
       const response = await fetch(url, config);
       console.log(`✅ API Response: ${response.status} ${endpoint}`);
       return await response.json();
     } catch (error) {
       console.error(`❌ API Error: ${endpoint}`, error);
       throw error;
     }
   }
   ```

3. **Backend Request Logging**
   ```yaml
   # Add to application.yml files
   logging:
     level:
       org.springframework.web: DEBUG
       com.vehiclebooking: DEBUG
   ```

### Step 17: Performance Optimization

1. **Frontend Optimization**
   ```javascript
   // Use React.memo for expensive components
   export const VehicleCard = React.memo(({ vehicle, onBook }) => {
     // Component implementation
   });

   // Implement lazy loading
   const AdminDashboard = React.lazy(() => import('./components/Admin/AdminDashboard'));
   ```

2. **Backend Optimization**
   ```java
   // Add caching to frequently accessed data
   @Cacheable("vehicles")
   public List<VehicleResponse> getAllVehicles() {
       return vehicleService.getAllVehicles();
   }
   ```

## ✅ Phase 7: Final Verification

### Step 18: Complete Integration Test

1. **Test All User Flows**
   - ✅ Admin login and user approval
   - ✅ Customer registration and login
   - ✅ Branch admin setup and vehicle requests
   - ✅ Customer vehicle search and booking
   - ✅ Branch admin booking approval

2. **Test Error Scenarios**
   - ✅ Network failures
   - ✅ Invalid credentials
   - ✅ Server errors
   - ✅ Token expiration

3. **Performance Testing**
   - ✅ Page load times
   - ✅ API response times
   - ✅ Large data sets

### Step 19: Documentation

1. **Create API Documentation**
   ```markdown
   # API Endpoints

   ## Authentication
   - POST /api/auth/login
   - POST /api/auth/validate

   ## Users
   - GET /api/users
   - POST /api/users/register
   - PUT /api/users/{id}/approve

   ## Vehicles
   - GET /api/vehicles
   - POST /api/vehicles
   - GET /api/vehicles/search

   ## Bookings
   - GET /api/bookings
   - POST /api/bookings
   - PUT /api/bookings/{id}/approve
   ```

2. **Create Deployment Guide**
   ```markdown
   # Deployment Steps
   1. Build frontend: `npm run build`
   2. Package backend: `mvn clean package`
   3. Deploy to production servers
   4. Configure environment variables
   5. Set up database connections
   ```

## 🎯 Success Criteria

Your integration is successful when:

- ✅ All backend services start without errors
- ✅ Frontend connects to API Gateway successfully
- ✅ User authentication works end-to-end
- ✅ All CRUD operations function properly
- ✅ Real-time data updates work
- ✅ Error handling is robust
- ✅ Performance is acceptable

## 🔧 Troubleshooting Common Issues

### Issue 1: CORS Errors
**Solution**: Add CORS configuration to backend services
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### Issue 2: 404 API Errors
**Solution**: Check API Gateway routing and service registration

### Issue 3: Authentication Failures
**Solution**: Verify JWT token format and expiration

### Issue 4: Database Connection Issues
**Solution**: Check database credentials and connectivity

### Issue 5: Port Conflicts
**Solution**: Ensure ports 8080, 8081, 8082, 8761, 5173 are available

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev/)
- [Eclipse IDE Guide](https://www.eclipse.org/documentation/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

**🎉 Congratulations!** You have successfully integrated your React frontend with Spring Boot microservices backend in Eclipse IDE. Your full-stack application is now ready for development and testing.