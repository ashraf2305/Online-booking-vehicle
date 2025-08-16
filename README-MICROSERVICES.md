# Vehicle Booking System - Microservices Architecture

A comprehensive vehicle booking platform built with Spring Boot microservices architecture, featuring service discovery, API gateway, and distributed data management.

## 🏗️ Architecture Overview

### Microservices
- **User Service** (Port 8081): Handles user authentication, authorization, and profile management
- **Vehicle Service** (Port 8082): Manages vehicles, bookings, and vehicle requests
- **Eureka Server** (Port 8761): Service discovery and registration
- **API Gateway** (Port 8080): Single entry point for all client requests

### Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Database**: MySQL 8.0 (H2 for development)
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Docker and Docker Compose
- MySQL 8.0 (optional, Docker will provide)

### Running with Docker Compose (Recommended)

1. **Clone and navigate to project directory**
   ```bash
   git clone <repository-url>
   cd vehicle-booking-microservices
   ```

2. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the services**
   - API Gateway: http://localhost:8080
   - Eureka Dashboard: http://localhost:8761
   - User Service: http://localhost:8081
   - Vehicle Service: http://localhost:8082

### Running Locally (Development)

1. **Start Eureka Server**
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

2. **Start User Service**
   ```bash
   cd user-service
   mvn spring-boot:run
   ```

3. **Start Vehicle Service**
   ```bash
   cd vehicle-service
   mvn spring-boot:run
   ```

4. **Start API Gateway**
   ```bash
   cd api-gateway
   mvn spring-boot:run
   ```

## 📡 API Endpoints

### User Service (via API Gateway: http://localhost:8080)

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/validate` - Validate JWT token

#### User Management
- `POST /api/users/register` - Register new user
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/userId/{userId}` - Get user by user ID
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/pending` - Get pending users (Admin only)
- `GET /api/users/branch-admins` - Get branch admins
- `PUT /api/users/{id}/approve` - Approve user (Admin only)
- `PUT /api/users/{id}/reject` - Reject user (Admin only)
- `PUT /api/users/{id}/profile` - Update user profile
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)

### Vehicle Service (via API Gateway: http://localhost:8080)

#### Vehicle Management
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `GET /api/vehicles/available` - Get available vehicles
- `GET /api/vehicles/search` - Search vehicles with filters
- `POST /api/vehicles` - Create new vehicle (Admin only)
- `PUT /api/vehicles/{id}` - Update vehicle (Admin only)
- `DELETE /api/vehicles/{id}` - Delete vehicle (Admin only)

#### Booking Management
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/customer/{customerId}` - Get customer bookings
- `GET /api/bookings/branch/{branchId}` - Get branch bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}/approve` - Approve booking (Branch Admin)
- `PUT /api/bookings/{id}/reject` - Reject booking (Branch Admin)

#### Vehicle Request Management
- `GET /api/requests` - Get all vehicle requests
- `GET /api/requests/branch/{branchId}` - Get branch requests
- `POST /api/requests` - Create vehicle request
- `PUT /api/requests/{id}/approve` - Approve request (Admin only)
- `PUT /api/requests/{id}/reject` - Reject request (Admin only)

## 🔐 Security

### JWT Authentication
- JWT tokens are issued by the User Service
- Tokens include user roles and permissions
- API Gateway validates tokens for protected routes

### Role-Based Access Control
- **ADMIN**: Full system access
- **BRANCH_ADMIN**: Branch-specific operations
- **CUSTOMER**: Customer-specific operations

### Default Credentials
- **Admin**: `admin` / `admin123`

## 🗄️ Database Schema

### User Service Database (vehicle_booking_users)
- `users` - User accounts and profiles
- `user_roles` - User role definitions

### Vehicle Service Database (vehicle_booking_vehicles)
- `vehicles` - Vehicle inventory
- `vehicle_features` - Vehicle features
- `bookings` - Customer bookings
- `vehicle_requests` - Branch vehicle requests

## 🐳 Docker Configuration

### Services
- **mysql**: MySQL 8.0 database
- **eureka-server**: Service discovery
- **user-service**: User management microservice
- **vehicle-service**: Vehicle management microservice
- **api-gateway**: API gateway and routing

### Volumes
- `mysql_data`: Persistent MySQL data storage

### Networks
- `vehicle-booking-network`: Internal service communication

## 📊 Monitoring and Health Checks

### Actuator Endpoints
- `/actuator/health` - Service health status
- `/actuator/info` - Service information
- `/actuator/metrics` - Service metrics

### Eureka Dashboard
- View registered services
- Monitor service health
- Service discovery status

## 🔧 Configuration

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: Active Spring profile
- `EUREKA_CLIENT_SERVICE_URL_DEFAULTZONE`: Eureka server URL
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Profiles
- `default`: Development with H2 database
- `docker`: Docker environment with MySQL
- `prod`: Production configuration

## 🚦 Service Communication

### Inter-Service Communication
- Services communicate via REST APIs
- Service discovery through Eureka
- Load balancing with Spring Cloud LoadBalancer
- Circuit breaker pattern for resilience

### API Gateway Routing
- `/api/users/**` → User Service
- `/api/auth/**` → User Service
- `/api/vehicles/**` → Vehicle Service
- `/api/bookings/**` → Vehicle Service
- `/api/requests/**` → Vehicle Service

## 🧪 Testing

### Unit Tests
```bash
# Test User Service
cd user-service
mvn test

# Test Vehicle Service
cd vehicle-service
mvn test
```

### Integration Tests
```bash
# Run all tests
mvn test -Dspring.profiles.active=test
```

## 📈 Scaling and Deployment

### Horizontal Scaling
- Multiple instances of each service
- Load balancing through API Gateway
- Database connection pooling

### Production Deployment
1. Build Docker images
2. Deploy to Kubernetes/Docker Swarm
3. Configure external databases
4. Set up monitoring and logging
5. Implement CI/CD pipeline

## 🔍 Troubleshooting

### Common Issues
1. **Service Registration**: Check Eureka server connectivity
2. **Database Connection**: Verify database credentials and connectivity
3. **Port Conflicts**: Ensure ports 8080, 8081, 8082, 8761 are available
4. **JWT Issues**: Check token expiration and secret key configuration

### Logs
```bash
# View service logs
docker-compose logs user-service
docker-compose logs vehicle-service
docker-compose logs api-gateway
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Spring Boot Microservices Architecture**