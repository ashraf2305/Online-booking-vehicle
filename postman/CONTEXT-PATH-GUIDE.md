# Context Path Configuration Guide

## Issue Identified
The microservices are configured with context paths:
- User Service: `http://localhost:8081/user-service`
- Vehicle Service: `http://localhost:8082/vehicle-service`

## URL Patterns

### ✅ Working URLs (With Context Paths)
```
User Service:    http://localhost:8081/user-service/api/auth/login
Vehicle Service: http://localhost:8082/vehicle-service/api/vehicles
Health Checks:   http://localhost:8081/user-service/actuator/health
```

### ❌ Non-Working URLs (Without Context Paths)
```
User Service:    http://localhost:8081/api/auth/login
Vehicle Service: http://localhost:8082/api/vehicles
Health Checks:   http://localhost:8081/actuator/health
```

## Gateway Routing
The API Gateway should route:
```
Gateway Request: http://localhost:8080/api/auth/login
↓ (RewritePath filter)
Service Call:    http://localhost:8081/user-service/api/auth/login
```

## Updated Postman Collection

### Environment Variables
- `user_service_direct_url`: `http://localhost:8081/user-service`
- `vehicle_service_direct_url`: `http://localhost:8082/vehicle-service`
- `base_url`: `http://localhost:8080` (Gateway)

### Request Types
- **⭐ Gateway Requests**: Use `{{base_url}}/api/*` (preferred)
- **🔄 Direct Requests**: Use `{{service_direct_url}}/api/*` (fallback)

## Testing Strategy
1. **Import updated collection and environment**
2. **Test health endpoints first**
3. **Try Gateway authentication**
4. **Fall back to Direct if Gateway fails**
5. **Use Direct requests to verify service functionality**

## Service Configuration
Each service has `server.servlet.context-path` set:
- User Service: `/user-service`
- Vehicle Service: `/vehicle-service`

This is why direct calls must include the context path in the URL.