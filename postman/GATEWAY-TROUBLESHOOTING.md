# API Gateway Troubleshooting Guide

## Issue: 404 Errors When Using Gateway

### Root Cause
The microservices are registering with context paths (`/user-service` and `/vehicle-service`), but the API Gateway routing wasn't properly configured to handle these context paths.

### Solution Applied
1. **Updated Gateway Configuration**: Modified `api-gateway/src/main/resources/application.yml` to use `RewritePath` filters that properly map gateway routes to service context paths.

2. **Enhanced Postman Collection**: Added both Gateway and Direct service endpoints for all requests to provide fallback options.

### New Gateway Route Configuration

```yaml
routes:
  # User Service routes - strip /api prefix and add /user-service context
  - id: user-service-auth
    uri: lb://user-service
    predicates:
      - Path=/api/auth/**
    filters:
      - RewritePath=/api/auth/(?<segment>.*), /user-service/api/auth/$\{segment}

  - id: user-service-users
    uri: lb://user-service
    predicates:
      - Path=/api/users/**
    filters:
      - RewritePath=/api/users/(?<segment>.*), /user-service/api/users/$\{segment}

  # Vehicle Service routes - strip /api prefix and add /vehicle-service context
  - id: vehicle-service-vehicles
    uri: lb://vehicle-service
    predicates:
      - Path=/api/vehicles/**
    filters:
      - RewritePath=/api/vehicles/(?<segment>.*), /vehicle-service/api/vehicles/$\{segment}
```

### Testing Steps

1. **Restart API Gateway** after configuration changes
2. **Check Gateway Routes**: Use `GET {{base_url}}/actuator/gateway/routes` to verify routes are loaded
3. **Test Both Options**: Each endpoint now has both Gateway and Direct versions
4. **Verify Service Registration**: Check Eureka dashboard at `http://localhost:8761`

### Environment Variables Added

- `user_service_direct_url`: `http://localhost:8081/user-service`
- `vehicle_service_direct_url`: `http://localhost:8082/vehicle-service`

### Request Flow

**Gateway Request**: `GET http://localhost:8080/api/users`
↓ (Gateway processes)
**Actual Service Call**: `GET http://localhost:8081/user-service/api/users`

### Debugging Commands

1. **Check Gateway Routes**:
   ```
   GET http://localhost:8080/actuator/gateway/routes
   ```

2. **Check Service Health**:
   ```
   GET http://localhost:8081/user-service/actuator/health
   GET http://localhost:8082/vehicle-service/actuator/health
   ```

3. **Check Eureka Registration**:
   ```
   GET http://localhost:8761
   ```

### Common Issues & Solutions

1. **404 on Gateway**: Use Direct service endpoints as fallback
2. **Service Not Registered**: Check Eureka dashboard, restart services in order
3. **Context Path Issues**: Verify service application.yml has correct context-path
4. **Route Not Working**: Check gateway logs for routing errors

### Service Startup Order
1. Eureka Server (8761)
2. User Service (8081)
3. Vehicle Service (8082)
4. API Gateway (8080)

Wait 30 seconds between each service startup for proper registration.