# Gateway 404 Debugging Steps

## Current Issue
Gateway at `localhost:8080` returns 404 errors, but direct service calls work.

## Step-by-Step Debugging

### 1. **Restart API Gateway**
After updating the configuration, restart the API Gateway service:
```bash
cd api-gateway
mvn spring-boot:run
```

### 2. **Verify Service Registration**
Check that all services are registered in Eureka:
- Open: http://localhost:8761
- Should see: `API-GATEWAY`, `USER-SERVICE`, `VEHICLE-SERVICE`

### 3. **Check Gateway Routes**
Use Postman request: **"Gateway Routes (Debug)"**
- URL: `http://localhost:8080/actuator/gateway/routes`
- Should show configured routes with proper predicates and filters

### 4. **Test Authentication Flow**

#### Option A: Gateway (Preferred)
1. Run: **"Admin Login (Gateway) ⭐"**
2. If successful, token is auto-saved
3. Continue with other Gateway requests

#### Option B: Direct (Fallback)
1. Run: **"Admin Login (Direct) 🔄"**
2. If successful, token is auto-saved
3. Use Direct requests for testing

### 5. **Common URL Patterns**

| Request Type | Gateway URL | Direct URL |
|-------------|-------------|------------|
| Login | `http://localhost:8080/api/auth/login` | `http://localhost:8081/user-service/api/auth/login` |
| Users | `http://localhost:8080/api/users` | `http://localhost:8081/user-service/api/users` |
| Vehicles | `http://localhost:8080/api/vehicles` | `http://localhost:8082/vehicle-service/api/vehicles` |

### 6. **Expected Gateway Route Mapping**

```
Gateway Request: GET /api/users
↓ (RewritePath filter)
Service Call: GET /user-service/api/users
```

### 7. **Troubleshooting Checklist**

- [ ] All services running (Eureka, User, Vehicle, Gateway)
- [ ] Services registered in Eureka dashboard
- [ ] Gateway routes visible in `/actuator/gateway/routes`
- [ ] Gateway health check returns UP
- [ ] Direct service calls work
- [ ] Updated Postman collection imported

### 8. **Service Startup Order**
1. Eureka Server (8761) - Wait 30 seconds
2. User Service (8081) - Wait for registration
3. Vehicle Service (8082) - Wait for registration  
4. API Gateway (8080) - Wait for registration

### 9. **Testing Strategy**
1. Start with **System Health & Debug** folder
2. Verify all health endpoints return UP
3. Check Gateway Routes (Debug) shows proper routes
4. Try Gateway authentication first
5. Fall back to Direct if Gateway fails
6. Use ⭐ (Gateway) requests when possible
7. Use 🔄 (Direct) requests as backup

### 10. **Success Indicators**
✅ Gateway health: UP
✅ All services in Eureka
✅ Gateway routes configured
✅ Authentication works via Gateway
✅ CRUD operations work via Gateway

If Gateway still fails, use Direct endpoints as a reliable fallback while debugging the routing configuration.