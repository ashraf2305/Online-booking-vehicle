# Vehicle Booking System - Module to File Mapping

This document provides a comprehensive mapping of each functional module to its related files in the Vehicle Booking System.

## 1. Authentication & Authorization Module

### Frontend Files:
- `src/components/Auth/Login.jsx` - Login/Registration form
- `src/components/Layout/Header.jsx` - Header with logout functionality
- `src/context/AppContext.jsx` - Authentication state management

### Backend Files:
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/AuthController.java` - Login/token validation endpoints
- `user-service/src/main/java/com/vehiclebooking/userservice/security/JwtTokenProvider.java` - JWT token generation/validation
- `user-service/src/main/java/com/vehiclebooking/userservice/security/JwtAuthenticationFilter.java` - JWT filter
- `user-service/src/main/java/com/vehiclebooking/userservice/security/JwtAuthenticationEntryPoint.java` - Auth entry point
- `user-service/src/main/java/com/vehiclebooking/userservice/security/SecurityConfig.java` - Security configuration
- `user-service/src/main/java/com/vehiclebooking/userservice/service/CustomUserDetailsService.java` - User details service

### DTOs:
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/LoginRequest.java` - Login request DTO

---

## 2. User Management Module

### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin user management interface
- `src/components/Customer/ProfileSetupForm.jsx` - Customer profile setup
- `src/components/BranchAdmin/ProfileSetupForm.jsx` - Branch admin profile setup

### Backend Files:
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/UserController.java` - User CRUD endpoints
- `user-service/src/main/java/com/vehiclebooking/userservice/service/UserService.java` - User business logic
- `user-service/src/main/java/com/vehiclebooking/userservice/repository/UserRepository.java` - User data access
- `user-service/src/main/java/com/vehiclebooking/userservice/config/DataInitializer.java` - Default admin user creation

### Entities:
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/User.java` - User entity
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/UserRole.java` - User role enum
- `user-service/src/main/java/com/vehiclebooking/userservice/entity/UserStatus.java` - User status enum

### DTOs:
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/UserRegistrationRequest.java` - Registration request
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/UserResponse.java` - User response
- `user-service/src/main/java/com/vehiclebooking/userservice/dto/ProfileUpdateRequest.java` - Profile update request

---

## 3. Branch Admin & Customer Registration Approval Module

### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin approval interface (Users tab)
- `src/components/Auth/Login.jsx` - Registration form with approval status

### Backend Files:
- `user-service/src/main/java/com/vehiclebooking/userservice/controller/UserController.java` - Approval endpoints:
  - `GET /api/users/pending` - Get pending users
  - `PUT /api/users/{id}/approve` - Approve user
  - `PUT /api/users/{id}/reject` - Reject user
- `user-service/src/main/java/com/vehiclebooking/userservice/service/UserService.java` - Approval business logic:
  - `getPendingUsers()` - Get users awaiting approval
  - `approveUser()` - Approve user registration
  - `rejectUser()` - Reject user registration

### Key Logic:
- Only approved users can login (checked in authentication)
- Admin sees all pending registrations sorted by role and date
- Status updates prevent login until approved

---

## 4. Vehicle Management Module

### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin vehicle management interface
- `src/components/Admin/VehicleForm.jsx` - Add/Edit vehicle form
- `src/components/Customer/VehicleCard.jsx` - Vehicle display card
- `src/components/Customer/CustomerDashboard.jsx` - Customer vehicle search

### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleController.java` - Vehicle CRUD endpoints
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleService.java` - Vehicle business logic
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/VehicleRepository.java` - Vehicle data access
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/config/DataInitializer.java` - Sample vehicle data

### Entities:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/Vehicle.java` - Vehicle entity

### DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequest.java` - Vehicle creation/update request
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleResponse.java` - Vehicle response

---

## 5. Branch Vehicle Request Module

### Frontend Files:
- `src/components/BranchAdmin/BranchDashboard.jsx` - Branch admin request interface
- `src/components/BranchAdmin/VehicleRequestForm.jsx` - Vehicle request form

### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleRequestController.java` - Request endpoints:
  - `POST /api/requests` - Create vehicle request
  - `GET /api/requests/branch/{branchId}` - Get branch requests
  - `GET /api/requests` - Get all requests (Admin)
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleRequestService.java` - Request business logic
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/VehicleRequestRepository.java` - Request data access

### Entities:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/VehicleRequest.java` - Request entity
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/RequestStatus.java` - Request status enum

### DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequestDto.java` - Request creation DTO
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/VehicleRequestResponse.java` - Request response DTO

---

## 6. Admin Vehicle Request Approval Module

### Frontend Files:
- `src/components/Admin/AdminDashboard.jsx` - Admin approval interface (Vehicle Requests tab)

### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/VehicleRequestController.java` - Approval endpoints:
  - `PUT /api/requests/{id}/approve` - Approve request (full or partial)
  - `PUT /api/requests/{id}/reject` - Reject request
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/VehicleRequestService.java` - Approval logic:
  - `approveRequest()` - Approve with quantity logic
  - `rejectRequest()` - Reject request

### Key Logic:
- Admin can approve full quantity, partial quantity, or reject
- Status automatically set based on approved vs requested quantity:
  - `APPROVED` - Full quantity approved
  - `PARTIALLY_APPROVED` - Less than requested approved
  - `REJECTED` - Zero quantity or explicit rejection
- Vehicle availability updated when approved

---

## 7. Customer Booking Module

### Frontend Files:
- `src/components/Customer/CustomerDashboard.jsx` - Customer booking interface
- `src/components/Customer/BookingForm.jsx` - Booking creation form
- `src/components/Customer/VehicleCard.jsx` - Vehicle selection

### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/BookingController.java` - Booking endpoints
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/BookingService.java` - Booking business logic
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/repository/BookingRepository.java` - Booking data access

### Entities:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/Booking.java` - Booking entity
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/entity/BookingStatus.java` - Booking status enum

### DTOs:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/BookingRequest.java` - Booking creation request
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/dto/BookingResponse.java` - Booking response

---

## 8. Branch Admin Booking Approval Module

### Frontend Files:
- `src/components/BranchAdmin/BranchDashboard.jsx` - Branch admin booking approval interface

### Backend Files:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/controller/BookingController.java` - Approval endpoints:
  - `PUT /api/bookings/{id}/approve` - Approve booking
  - `PUT /api/bookings/{id}/reject` - Reject booking
  - `GET /api/bookings/branch/{branchId}` - Get branch bookings
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/service/BookingService.java` - Approval logic

---

## 9. API Gateway & Service Discovery Module

### Gateway Files:
- `api-gateway/src/main/java/com/vehiclebooking/apigateway/ApiGatewayApplication.java` - Gateway main class
- `api-gateway/src/main/resources/application.yml` - Gateway routing configuration

### Eureka Server Files:
- `eureka-server/src/main/java/com/vehiclebooking/eurekaserver/EurekaServerApplication.java` - Eureka main class
- `eureka-server/src/main/resources/application.yml` - Eureka configuration

### Service Configuration:
- `user-service/src/main/resources/application.yml` - User service config
- `vehicle-service/src/main/resources/application.yml` - Vehicle service config

---

## 10. Exception Handling Module

### User Service:
- `user-service/src/main/java/com/vehiclebooking/userservice/exception/GlobalExceptionHandler.java` - Global exception handler
- `user-service/src/main/java/com/vehiclebooking/userservice/exception/UserNotFoundException.java` - User not found exception
- `user-service/src/main/java/com/vehiclebooking/userservice/exception/UserAlreadyExistsException.java` - User exists exception

### Vehicle Service:
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/exception/GlobalExceptionHandler.java` - Global exception handler
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/exception/VehicleNotFoundException.java` - Vehicle not found exception
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/exception/BookingNotFoundException.java` - Booking not found exception
- `vehicle-service/src/main/java/com/vehiclebooking/vehicleservice/exception/VehicleRequestNotFoundException.java` - Request not found exception

---

## 11. State Management Module (Frontend)

### Context Files:
- `src/context/AppContext.jsx` - Global state management with useReducer
- `src/types.js` - Type definitions and JSDoc comments

---

## 12. Configuration & Build Module

### Build Files:
- `package.json` - Frontend dependencies and scripts
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Maven Files:
- `user-service/pom.xml` - User service dependencies
- `vehicle-service/pom.xml` - Vehicle service dependencies
- `api-gateway/pom.xml` - API Gateway dependencies
- `eureka-server/pom.xml` - Eureka server dependencies

### Docker Files:
- `docker-compose.yml` - Multi-service Docker configuration
- `user-service/Dockerfile` - User service Docker image
- `vehicle-service/Dockerfile` - Vehicle service Docker image
- `api-gateway/Dockerfile` - API Gateway Docker image
- `eureka-server/Dockerfile` - Eureka server Docker image

---

## 13. Testing & Documentation Module

### Testing Files:
- `postman/Vehicle-Booking-Microservices.postman_collection.json` - API test collection
- `postman/Vehicle-Booking-Environment.postman_environment.json` - Test environment

### Documentation Files:
- `README.md` - Main project documentation
- `README-MICROSERVICES.md` - Microservices architecture documentation
- `ECLIPSE-SETUP-GUIDE.md` - Eclipse IDE setup guide
- `POSTMAN_EXECUTION_GUIDE.md` - Postman testing guide
- `postman/API-Testing-Instructions.md` - API testing instructions
- `postman/GATEWAY-TROUBLESHOOTING.md` - Gateway troubleshooting guide

---

## Key Workflow Files Summary

### For Branch Vehicle Request & Approval:

**Branch Admin Side:**
1. `src/components/BranchAdmin/VehicleRequestForm.jsx` - Create request
2. `src/components/BranchAdmin/BranchDashboard.jsx` - View request status
3. `vehicle-service/.../VehicleRequestController.java` - Handle requests

**Admin Side:**
1. `src/components/Admin/AdminDashboard.jsx` - View and approve requests
2. `vehicle-service/.../VehicleRequestController.java` - Approval endpoints
3. `vehicle-service/.../VehicleRequestService.java` - Approval logic

**Status Flow:**
- `PENDING` → `APPROVED` / `PARTIALLY_APPROVED` / `REJECTED`
- Vehicle availability updated on approval
- Branch admin sees updated status on dashboard