# Vehicle Booking System - Complete Module to File Mapping

This document provides a comprehensive mapping of each functional module to its related files in the Vehicle Booking System.

## Module 1: Login Page and New Registration Module

### Requirements:
- Already registered users can login
- New users register with userId, Password, and role
- Branch admin enters branch details on first login
- Customer enters personal details on first login
- Only admin-approved users can login

### Related Files:

#### Frontend Files:
- `src/components/Auth/Login.jsx` - Main login/registration form with role selection
- `src/components/Layout/Header.jsx` - Header with logout functionality and user info
- `src/components/BranchAdmin/ProfileSetupForm.jsx` - Branch admin profile setup form
- `src/components/Customer/ProfileSetupForm.jsx` - Customer profile setup form
- `src/context/AppContext.jsx` - Authentication state management

#### Backend Files:
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/AuthController.java` - Login/token validation endpoints
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/UserController.java` - User registration endpoints
- `user-service/src/main/java/com/vehiclebooking/userservice/service/UserService.java` - User registration and profile management
- `user-service/src/main/java/com/vehiclebooking/userservice/security/JwtTokenProvider.java` - JWT token generation/validation
- `user-service/src/main/java/com/vehiclebooking/userservice/security/JwtAuthenticationFilter.java` - JWT authentication filter
- `user-service/src/main/java/com/vehiclebooking/userservice/security/SecurityConfig.java` - Security configuration
- `user-service/src/main/java/com/vehiclebooking/userservice/service/CustomUserDetailsService.java` - User details service
- `user-service/src/main/java/com/vehiclebooking/userservice/config/DataInitializer.java` - Default admin user creation

#### Entities & DTOs:
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/User.java` - User entity with profile fields
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/UserRole.java` - User role enum (ADMIN, BRANCH_ADMIN, CUSTOMER)
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/UserStatus.java` - User status enum (PENDING, APPROVED, REJECTED)
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/LoginRequest.java` - Login request DTO
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/UserRegistrationRequest.java` - Registration request DTO
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/UserResponse.java` - User response DTO
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/ProfileUpdateRequest.java` - Profile update DTO

#### Repository:
- `user-service/src/main/java/com/vehiclebooking/userservice/repository/UserRepository.java` - User data access

---

## Module 2: Add/Edit Vehicle Module

### Requirements:
- Admin can add new vehicle details
- Admin can edit existing vehicle details
- Vehicle management for warehouse inventory

### Related Files:

#### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin vehicle management interface (Vehicles tab)
- `src/components/Admin/VehicleForm.jsx` - Add/Edit vehicle form with all vehicle fields

#### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleController.java` - Vehicle CRUD endpoints
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleService.java` - Vehicle business logic
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/config/DataInitializer.java` - Sample vehicle data initialization

#### Entities & DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/Vehicle.java` - Vehicle entity
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequest.java` - Vehicle creation/update request DTO
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleResponse.java` - Vehicle response DTO

#### Repository:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/VehicleRepository.java` - Vehicle data access

---

## Module 3: Branch Vehicle Request and Approval Module

### Requirements:
- Admin views all branch admin and customer registration requests
- Admin approves/rejects user registrations
- Branch admin requests vehicles from warehouse
- Admin approves full/partial/rejects vehicle requests based on availability
- Status displayed to branch admin

### Related Files:

#### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin interface for:
  - User approval (Users tab)
  - Vehicle request approval (Vehicle Requests tab)
- `src/components/BranchAdmin/BranchDashboard.jsx` - Branch admin interface showing request status
- `src/components/BranchAdmin/VehicleRequestForm.jsx` - Vehicle request form

#### Backend Files:
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/UserController.java` - User approval endpoints:
  - `GET /api/users/pending` - Get pending registrations
  - `PUT /api/users/{id}/approve` - Approve user
  - `PUT /api/users/{id}/reject` - Reject user
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleRequestController.java` - Vehicle request endpoints:
  - `POST /api/requests` - Create vehicle request
  - `GET /api/requests` - Get all requests (Admin)
  - `GET /api/requests/branch/{branchId}` - Get branch requests
  - `PUT /api/requests/{id}/approve` - Approve request
  - `PUT /api/requests/{id}/reject` - Reject request
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleRequestService.java` - Request business logic

#### Entities & DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/VehicleRequest.java` - Vehicle request entity
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/RequestStatus.java` - Request status enum (PENDING, APPROVED, PARTIALLY_APPROVED, REJECTED)
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequestDto.java` - Request creation DTO
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequestResponse.java` - Request response DTO

#### Repository:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/VehicleRequestRepository.java` - Request data access

---

## Module 4: Customer Vehicle Request and Approval Module

### Requirements:
- Branch admin views all customer booking requests
- Branch admin approves based on availability
- Status displayed as In Process/Accepted/Rejected
- Customer can view booking status

### Related Files:

#### Frontend Files:
- `src/components/BranchAdmin/BranchDashboard.jsx` - Branch admin interface (Customer Bookings tab)
- `src/components/Customer/CustomerDashboard.jsx` - Customer interface (My Bookings tab)

#### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/BookingController.java` - Booking management endpoints:
  - `GET /api/bookings` - Get all bookings
  - `GET /api/bookings/branch/{branchId}` - Get branch bookings
  - `GET /api/bookings/customer/{customerId}` - Get customer bookings
  - `PUT /api/bookings/{id}/approve` - Approve booking
  - `PUT /api/bookings/{id}/reject` - Reject booking
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/BookingService.java` - Booking business logic

#### Entities & DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/Booking.java` - Booking entity
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/BookingStatus.java` - Booking status enum (PENDING, APPROVED, REJECTED, IN_PROCESS, COMPLETED, CANCELLED)
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/BookingRequest.java` - Booking creation DTO
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/BookingResponse.java` - Booking response DTO

#### Repository:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/BookingRepository.java` - Booking data access

---

## Module 5: Customer Search and Booking Module

### Requirements:
- Customer searches vehicles by type, price range, etc.
- Vehicles displayed with booking option
- Customer can book vehicles

### Related Files:

#### Frontend Files:
- `src/components/Customer/CustomerDashboard.jsx` - Customer main interface (Search & Book tab)
- `src/components/Customer/VehicleCard.jsx` - Vehicle display card with booking button
- `src/components/Customer/BookingForm.jsx` - Vehicle booking form

#### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleController.java` - Vehicle search endpoints:
  - `GET /api/vehicles` - Get all vehicles
  - `GET /api/vehicles/available` - Get available vehicles
  - `GET /api/vehicles/search` - Search with filters
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/BookingController.java` - Booking creation:
  - `POST /api/bookings` - Create booking
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleService.java` - Vehicle search logic
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/BookingService.java` - Booking creation logic

#### Repository:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/VehicleRepository.java` - Vehicle search queries
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/BookingRepository.java` - Booking data access

---

## Common Infrastructure Files

### API Gateway & Service Discovery:
- `api-gateway/src/main/java/com/vehiclebooking/apigateway/ApiGatewayApplication.java` - Gateway main class
- `api-gateway/src/main/resources/application.yml` - Gateway routing configuration
- `eureka-server/src/main/java/com/vehiclebooking/eurekaserver/EurekaServerApplication.java` - Eureka main class
- `eureka-server/src/main/resources/application.yml` - Eureka configuration

### Service Configuration:
- `user-service/src/main/resources/application.yml` - User service configuration
- `vehicle-service/src/main/resources/application.yml` - Vehicle service configuration
- `user-service/src/main/java/com/vehiclebooking/userservice/UserServiceApplication.java` - User service main class
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/VehicleServiceApplication.java` - Vehicle service main class

### Exception Handling:
- `user-service/src/main/java/com/vehiclebooking/userservice/exception/GlobalExceptionHandler.java` - User service exceptions
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/exception/GlobalExceptionHandler.java` - Vehicle service exceptions

### State Management (Frontend):
- `src/context/AppContext.jsx` - Global state management with useReducer
- `src/types.js` - Type definitions and JSDoc comments

### Build & Configuration:
- `package.json` - Frontend dependencies and scripts
- `user-service/pom.xml` - User service Maven dependencies
- `vehicle-service/pom.xml` - Vehicle service Maven dependencies
- `api-gateway/pom.xml` - API Gateway Maven dependencies
- `eureka-server/pom.xml` - Eureka server Maven dependencies

### Docker & Deployment:
- `docker-compose.yml` - Multi-service Docker configuration
- `user-service/Dockerfile` - User service Docker image
- `vehicle-service/Dockerfile` - Vehicle service Docker image
- `api-gateway/Dockerfile` - API Gateway Docker image
- `eureka-server/Dockerfile` - Eureka server Docker image

### Testing & Documentation:
- `postman/Vehicle-Booking-Microservices.postman_collection.json` - API test collection
- `postman/Vehicle-Booking-Environment.postman_environment.json` - Test environment
- `README.md` - Main project documentation
- `README-MICROSERVICES.md` - Microservices architecture documentation

---

## Module Interaction Flow

### User Registration & Approval Flow:
1. **Registration**: `Login.jsx` → `AuthController.java` → `UserService.java`
2. **Admin Approval**: `AdminDashboard.jsx` → `UserController.java` → `UserService.java`
3. **Profile Setup**: `ProfileSetupForm.jsx` → `UserController.java` → `UserService.java`

### Vehicle Request & Approval Flow:
1. **Branch Request**: `VehicleRequestForm.jsx` → `VehicleRequestController.java` → `VehicleRequestService.java`
2. **Admin Approval**: `AdminDashboard.jsx` → `VehicleRequestController.java` → `VehicleRequestService.java`
3. **Status Display**: `BranchDashboard.jsx` → `VehicleRequestController.java`

### Customer Booking Flow:
1. **Search**: `CustomerDashboard.jsx` → `VehicleController.java` → `VehicleService.java`
2. **Booking**: `BookingForm.jsx` → `BookingController.java` → `BookingService.java`
3. **Approval**: `BranchDashboard.jsx` → `BookingController.java` → `BookingService.java`
4. **Status**: `CustomerDashboard.jsx` → `BookingController.java`

This comprehensive mapping shows exactly which files handle each module's functionality and how they interact with each other in the Vehicle Booking System.