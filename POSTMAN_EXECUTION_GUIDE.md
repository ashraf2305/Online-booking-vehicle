# Vehicle Booking Microservices - Postman Execution Guide

## Prerequisites
- Java 17+ installed
- Maven installed
- MySQL server running with your credentials
- Postman installed
- All services configured with your database credentials

## Step 1: Start Services in Correct Order

### 1.1 Start Eureka Server (Port 8761)
```bash
cd eureka-server
mvn spring-boot:run
```
**Wait for**: "Started EurekaServerApplication" message
**Verify**: Open http://localhost:8761 - you should see Eureka Dashboard

### 1.2 Start User Service (Port 8081)
```bash
cd user-service
mvn spring-boot:run
```
**Wait for**: "Started UserServiceApplication" message
**Verify**: Check Eureka Dashboard - USER-SERVICE should appear

### 1.3 Start Vehicle Service (Port 8082)
```bash
cd vehicle-service
mvn spring-boot:run
```
**Wait for**: "Started VehicleServiceApplication" message
**Verify**: Check Eureka Dashboard - VEHICLE-SERVICE should appear

### 1.4 Start API Gateway (Port 8080)
```bash
cd api-gateway
mvn spring-boot:run
```
**Wait for**: "Started ApiGatewayApplication" message
**Verify**: Check Eureka Dashboard - API-GATEWAY should appear

## Step 2: Import Postman Collection

### 2.1 Download Collection Files
- `Vehicle-Booking-Microservices.postman_collection.json`
- `Vehicle-Booking-Environment.postman_environment.json`

### 2.2 Import into Postman
1. Open Postman
2. Click **Import** button (top left)
3. Drag and drop both JSON files
4. Click **Import**

### 2.3 Select Environment
1. Click environment dropdown (top right)
2. Select **"Vehicle Booking Local"**

## Step 3: Verify Services are Running

### 3.1 Test Health Endpoints
Execute these requests in order:

1. **Eureka Dashboard**
   - GET: `{{eureka_url}}`
   - Expected: HTML page showing registered services

2. **API Gateway Health**
   - GET: `{{base_url}}/actuator/health`
   - Expected: `{"status":"UP"}`

3. **User Service Health (Direct)**
   - GET: `{{user_service_url}}/user-service/actuator/health`
   - Expected: `{"status":"UP"}`

4. **Vehicle Service Health (Direct)**
   - GET: `{{vehicle_service_url}}/vehicle-service/actuator/health`
   - Expected: `{"status":"UP"}`

## Step 4: Authentication Testing

### 4.1 Admin Login (Primary Test)
**Request**: `Admin Login (Gateway)`
- Method: POST
- URL: `{{base_url}}/api/auth/login`
- Body:
```json
{
  "userId": "admin",
  "password": "admin123"
}
```

**Expected Response**:
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

**Important**: The token is automatically saved to environment variable `auth_token`

### 4.2 Alternative Login (If Gateway Fails)
If the gateway login fails, try direct service:

**Request**: `Admin Login (Direct)`
- URL: `{{user_service_url}}/user-service/api/auth/login`
- Same body as above

### 4.3 Validate Token
**Request**: `Validate Token`
- Method: POST
- URL: `{{base_url}}/api/auth/validate`
- Headers: `Authorization: Bearer {{auth_token}}`

## Step 5: User Management Testing

### 5.1 Register New Customer
**Request**: `Register Customer (Gateway)`
- Method: POST
- URL: `{{base_url}}/api/users/register`
- Body:
```json
{
  "userId": "customer1",
  "password": "password123",
  "role": "CUSTOMER"
}
```

### 5.2 Get Pending Users (Admin Only)
**Request**: `Get Pending Users`
- Method: GET
- URL: `{{base_url}}/api/users/pending`
- Headers: `Authorization: Bearer {{auth_token}}`

### 5.3 Approve User (Admin Only)
**Request**: `Approve User`
- Method: PUT
- URL: `{{base_url}}/api/users/{id}/approve`
- Replace `{id}` with the user ID from previous response
- Headers: `Authorization: Bearer {{auth_token}}`

### 5.4 Test Customer Login
**Request**: `Customer Login`
- Method: POST
- URL: `{{base_url}}/api/auth/login`
- Body:
```json
{
  "userId": "customer1",
  "password": "password123"
}
```

## Step 6: Vehicle Management Testing

### 6.1 Get All Vehicles
**Request**: `Get All Vehicles`
- Method: GET
- URL: `{{base_url}}/api/vehicles`
- Headers: `Authorization: Bearer {{auth_token}}`

### 6.2 Add New Vehicle (Admin Only)
**Request**: `Add Vehicle (Admin Only)`
- Method: POST
- URL: `{{base_url}}/api/vehicles`
- Headers: `Authorization: Bearer {{auth_token}}`
- Body:
```json
{
  "name": "Toyota Camry 2024",
  "type": "Sedan",
  "brand": "Toyota",
  "model": "Camry",
  "year": 2024,
  "pricePerDay": 85.00,
  "features": ["AC", "GPS", "Bluetooth", "Backup Camera"],
  "fuelType": "Petrol",
  "transmission": "Automatic",
  "seatingCapacity": 5,
  "imageUrl": "https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg",
  "totalStock": 10
}
```

### 6.3 Search Vehicles
**Request**: `Search Vehicles`
- Method: GET
- URL: `{{base_url}}/api/vehicles/search?type=Sedan&minPrice=50&maxPrice=150`
- Headers: `Authorization: Bearer {{auth_token}}`

## Step 7: Booking Flow Testing

### 7.1 Create Booking (Customer)
**Request**: `Create Booking`
- Method: POST
- URL: `{{base_url}}/api/bookings`
- Headers: `Authorization: Bearer {{auth_token}}`
- Body:
```json
{
  "customerId": 2,
  "customerName": "John Doe",
  "vehicleId": 1,
  "vehicleName": "Toyota Camry",
  "branchId": 3,
  "branchName": "Downtown Branch",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "totalAmount": 340.00
}
```

### 7.2 Get Customer Bookings
**Request**: `Get Customer Bookings`
- Method: GET
- URL: `{{base_url}}/api/bookings/customer/2`
- Headers: `Authorization: Bearer {{auth_token}}`

### 7.3 Approve Booking (Branch Admin)
**Request**: `Approve Booking`
- Method: PUT
- URL: `{{base_url}}/api/bookings/{id}/approve`
- Headers: `Authorization: Bearer {{auth_token}}`
- Body:
```json
{
  "branchAdminNotes": "Booking approved. Vehicle ready for pickup."
}
```

## Troubleshooting Common Issues

### Issue 1: 404 Not Found
**Symptoms**: API calls return 404
**Solutions**:
1. Check Eureka Dashboard - ensure all services are registered
2. Try direct service URLs instead of gateway
3. Verify service startup order
4. Check application.yml context paths

### Issue 2: 401 Unauthorized
**Symptoms**: Protected endpoints return 401
**Solutions**:
1. Ensure you've logged in successfully
2. Check if token is saved in environment
3. Verify Authorization header format: `Bearer {{auth_token}}`

### Issue 3: Connection Refused
**Symptoms**: Cannot connect to services
**Solutions**:
1. Verify all services are running
2. Check port availability (8080, 8081, 8082, 8761)
3. Restart services in correct order

### Issue 4: Database Connection Error
**Symptoms**: Service fails to start with DB errors
**Solutions**:
1. Verify MySQL is running
2. Check database credentials in application.yml
3. Ensure databases exist: `userdb`, `vehicledb`
4. Verify user permissions

## Testing Sequence Recommendation

1. **Health Checks** - Verify all services are running
2. **Admin Login** - Get authentication token
3. **User Registration** - Register customer and branch admin
4. **User Approval** - Admin approves pending users
5. **Vehicle Management** - Add and manage vehicles
6. **Customer Login** - Test customer authentication
7. **Booking Flow** - Create and manage bookings
8. **Vehicle Requests** - Test branch admin vehicle requests

## Environment Variables Used

- `base_url`: http://localhost:8080 (API Gateway)
- `user_service_url`: http://localhost:8081 (Direct User Service)
- `vehicle_service_url`: http://localhost:8082 (Direct Vehicle Service)
- `eureka_url`: http://localhost:8761 (Eureka Server)
- `auth_token`: Automatically saved after login

## Success Indicators

✅ All health endpoints return `{"status":"UP"}`
✅ Eureka Dashboard shows all 4 services registered
✅ Admin login returns JWT token
✅ Token validation succeeds
✅ User registration and approval works
✅ Vehicle CRUD operations succeed
✅ Booking creation and approval works

Follow this guide step by step, and you'll have a fully functional microservices system tested through Postman!