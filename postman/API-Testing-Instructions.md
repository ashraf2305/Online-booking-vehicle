# Postman API Testing Instructions

## 🚀 Quick Setup

### Step 1: Import Collection and Environment
1. **Download Files:**
   - `Vehicle-Booking-Microservices.postman_collection.json`
   - `Vehicle-Booking-Environment.postman_environment.json`

2. **Import into Postman:**
   - Open Postman
   - Click "Import" button
   - Drag and drop both files
   - Select the "Vehicle Booking Local" environment

### Step 2: Verify Services are Running
Before testing APIs, ensure all services are running:

1. **Eureka Server**: http://localhost:8761
2. **API Gateway**: http://localhost:8080
3. **User Service**: http://localhost:8081
4. **Vehicle Service**: http://localhost:8082

## 🔍 Troubleshooting 404 Errors

### Common URL Issues and Solutions:

#### Issue 1: API Gateway Routing
**Problem:** `{{base_url}}/api/auth/login` returns 404

**Solutions to try:**
1. **Check Eureka Dashboard**: http://localhost:8761
   - Verify USER-SERVICE is registered
   - Verify API-GATEWAY is registered

2. **Test Direct Service**: 
   ```
   POST http://localhost:8081/user-service/api/auth/login
   ```

3. **Check Service Context Path**:
   - User Service might have `/user-service` context path
   - Try: `{{user_service_url}}/user-service/api/auth/login`

#### Issue 2: Service Not Registered
**Problem:** Services not showing in Eureka

**Solution:**
1. Start services in correct order:
   - Eureka Server first
   - User Service
   - Vehicle Service  
   - API Gateway last

2. Wait 30 seconds between each service startup

#### Issue 3: Wrong Port or URL
**Problem:** Connection refused

**Solution:**
1. Verify ports in Eclipse console:
   ```
   Eureka Server: Started on port 8761
   User Service: Started on port 8081
   Vehicle Service: Started on port 8082
   API Gateway: Started on port 8080
   ```

## 📋 Testing Sequence

### Phase 1: Health Checks
1. **Eureka Dashboard** - Verify service registration
2. **API Gateway Health** - Check gateway is running
3. **User Service Health** - Direct service check
4. **Vehicle Service Health** - Direct service check

### Phase 2: Authentication
1. **Admin Login (Gateway)** - Test through API Gateway
2. **Admin Login (Direct)** - Test direct to User Service
3. **Token Validation** - Verify JWT token works

### Phase 3: User Management
1. **Register Customer** - Test user registration
2. **Get Pending Users** - Admin view pending approvals
3. **Approve User** - Admin approves registration
4. **Customer Login** - Test approved user login

### Phase 4: Vehicle Operations
1. **Get All Vehicles** - List available vehicles
2. **Add Vehicle** - Admin adds new vehicle
3. **Search Vehicles** - Test filtering
4. **Update Vehicle** - Admin updates vehicle

### Phase 5: Booking Flow
1. **Create Booking** - Customer books vehicle
2. **Get Customer Bookings** - View customer bookings
3. **Approve Booking** - Branch admin approves
4. **Get Branch Bookings** - Branch view

## 🔧 URL Variations to Try

If you get 404 errors, try these URL patterns:

### Authentication Endpoints:
```
# Option 1: Through API Gateway
POST {{base_url}}/api/auth/login

# Option 2: Direct with context path
POST {{user_service_url}}/user-service/api/auth/login

# Option 3: Direct without context path
POST {{user_service_url}}/api/auth/login
```

### User Registration:
```
# Option 1: Through API Gateway
POST {{base_url}}/api/users/register

# Option 2: Direct with context path
POST {{user_service_url}}/user-service/api/users/register

# Option 3: Direct without context path
POST {{user_service_url}}/api/users/register
```

## 🎯 Expected Responses

### Successful Admin Login:
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "user": {
    "id": 1,
    "userId": "admin",
    "role": "ADMIN",
    "status": "APPROVED"
  },
  "message": "Login successful"
}
```

### Successful User Registration:
```json
{
  "id": 2,
  "userId": "customer1",
  "role": "CUSTOMER",
  "status": "PENDING",
  "createdAt": "2024-01-15T10:30:00"
}
```

## 🚨 Common Error Solutions

### 404 Not Found
1. Check service registration in Eureka
2. Try direct service URLs
3. Verify context paths
4. Check service startup order

### 401 Unauthorized
1. Ensure token is set in environment
2. Check Authorization header format
3. Verify token hasn't expired

### 500 Internal Server Error
1. Check Eclipse console logs
2. Verify database connectivity
3. Check for validation errors

### Connection Refused
1. Verify all services are running
2. Check port availability
3. Restart services in correct order

## 📝 Testing Tips

1. **Use Collection Variables**: Token is automatically saved after login
2. **Check Console**: View request/response details
3. **Test in Order**: Follow the testing sequence
4. **Monitor Logs**: Watch Eclipse console for errors
5. **Use Environment**: Switch between local/dev/prod easily

## 🔄 Quick Reset

If things aren't working:
1. Stop all services in Eclipse
2. Start Eureka Server, wait 30 seconds
3. Start User Service, wait for registration
4. Start Vehicle Service, wait for registration
5. Start API Gateway, wait for registration
6. Check Eureka dashboard shows all services
7. Test health endpoints first
8. Then test authentication

This collection provides comprehensive testing for all microservices endpoints with proper error handling and troubleshooting guidance!