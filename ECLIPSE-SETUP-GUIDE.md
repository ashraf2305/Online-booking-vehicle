# Spring Boot Microservices Implementation in Eclipse IDE

## Prerequisites

### Software Requirements
1. **Java Development Kit (JDK) 17 or higher**
   - Download from: https://adoptium.net/
   - Verify installation: `java -version`

2. **Eclipse IDE for Enterprise Java and Web Developers**
   - Download from: https://www.eclipse.org/downloads/packages/
   - Choose "Eclipse IDE for Enterprise Java and Web Developers"

3. **Maven** (Usually included with Eclipse)
   - Verify: Help → About Eclipse IDE → Installation Details

4. **MySQL Server** (Optional - can use H2 for development)
   - Download from: https://dev.mysql.com/downloads/mysql/

## Step 1: Eclipse IDE Setup

### 1.1 Install Spring Tools Suite (STS) Plugin
1. Open Eclipse IDE
2. Go to **Help** → **Eclipse Marketplace**
3. Search for "Spring Tools 4"
4. Install **Spring Tools 4 (aka Spring Tool Suite 4)**
5. Restart Eclipse when prompted

### 1.2 Configure Maven
1. Go to **Window** → **Preferences**
2. Navigate to **Maven** → **Installations**
3. Ensure Maven is properly configured
4. Go to **Maven** → **User Settings**
5. Verify settings.xml location

### 1.3 Set Java Build Path
1. Go to **Window** → **Preferences**
2. Navigate to **Java** → **Installed JREs**
3. Ensure JDK 17+ is selected as default

## Step 2: Create Workspace and Import Projects

### 2.1 Create New Workspace
1. **File** → **Switch Workspace** → **Other**
2. Create new folder: `C:\workspace\vehicle-booking-microservices`
3. Click **Launch**

### 2.2 Import Maven Projects
1. **File** → **Import**
2. Select **Maven** → **Existing Maven Projects**
3. Browse to your project root directory
4. Select all four projects:
   - eureka-server
   - user-service
   - vehicle-service
   - api-gateway
5. Click **Finish**

## Step 3: Project-by-Project Setup

### 3.1 Eureka Server Setup

#### Create New Spring Boot Project (Alternative Method)
1. **File** → **New** → **Other**
2. Select **Spring Boot** → **Spring Starter Project**
3. Fill project details:
   - **Name**: eureka-server
   - **Group**: com.vehiclebooking
   - **Artifact**: eureka-server
   - **Package**: com.vehiclebooking.eurekaserver
   - **Java Version**: 17
   - **Spring Boot Version**: 3.2.0

4. Select Dependencies:
   - **Eureka Server** (Spring Cloud Discovery)
   - **Actuator** (Spring Boot Actuator)

5. Click **Finish**

#### Configure Eureka Server
1. Replace `src/main/resources/application.properties` with `application.yml`
2. Copy the Eureka Server configuration from the provided files
3. Add `@EnableEurekaServer` annotation to main class

### 3.2 User Service Setup

#### Create User Service Project
1. **File** → **New** → **Other**
2. Select **Spring Boot** → **Spring Starter Project**
3. Fill project details:
   - **Name**: user-service
   - **Group**: com.vehiclebooking
   - **Artifact**: user-service
   - **Package**: com.vehiclebooking.userservice

4. Select Dependencies:
   - **Spring Web**
   - **Spring Data JPA**
   - **Spring Security**
   - **Validation**
   - **Actuator**
   - **Eureka Discovery Client**
   - **OpenFeign**
   - **H2 Database** (for development)
   - **MySQL Driver** (for production)

#### Add JWT Dependencies
1. Right-click on **user-service** project
2. Select **Maven** → **Add Dependency**
3. Add JWT dependencies:
   ```xml
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt-api</artifactId>
       <version>0.11.5</version>
   </dependency>
   ```

#### Create Package Structure
1. Right-click on `src/main/java/com.vehiclebooking.userservice`
2. Create packages:
   - `entity`
   - `repository`
   - `service`
   - `controller`
   - `dto`
   - `security`
   - `exception`
   - `config`

### 3.3 Vehicle Service Setup

#### Create Vehicle Service Project
1. Follow similar steps as User Service
2. Select Dependencies:
   - **Spring Web**
   - **Spring Data JPA**
   - **Validation**
   - **Actuator**
   - **Eureka Discovery Client**
   - **OpenFeign**
   - **H2 Database**
   - **MySQL Driver**

#### Create Package Structure
1. Create same package structure as User Service
2. Add vehicle-specific packages if needed

### 3.4 API Gateway Setup

#### Create API Gateway Project
1. **File** → **New** → **Other**
2. Select **Spring Boot** → **Spring Starter Project**
3. Select Dependencies:
   - **Gateway** (Spring Cloud Gateway)
   - **Eureka Discovery Client**
   - **Actuator**

## Step 4: Implement Code Structure

### 4.1 Copy Source Code
1. Copy all Java classes from the provided project structure
2. For each service, copy:
   - Entity classes
   - Repository interfaces
   - Service classes
   - Controller classes
   - DTOs
   - Configuration classes

### 4.2 Configure Application Properties
1. Copy `application.yml` files for each service
2. Adjust database configurations as needed
3. Configure ports and service names

## Step 5: Database Setup

### 5.1 H2 Database (Development)
1. No additional setup required
2. Access H2 console: `http://localhost:8081/user-service/h2-console`
3. Use connection details from application.yml

### 5.2 MySQL Database (Production)
1. Install MySQL Server
2. Create databases:
   ```sql
   CREATE DATABASE vehicle_booking_users;
   CREATE DATABASE vehicle_booking_vehicles;
   ```
3. Create user and grant permissions:
   ```sql
   CREATE USER 'vehicleuser'@'localhost' IDENTIFIED BY 'vehiclepass';
   GRANT ALL PRIVILEGES ON vehicle_booking_users.* TO 'vehicleuser'@'localhost';
   GRANT ALL PRIVILEGES ON vehicle_booking_vehicles.* TO 'vehicleuser'@'localhost';
   ```

## Step 6: Running the Services

### 6.1 Start Services in Order
1. **Start Eureka Server First**
   - Right-click on `eureka-server` project
   - **Run As** → **Spring Boot App**
   - Wait for startup (check http://localhost:8761)

2. **Start User Service**
   - Right-click on `user-service` project
   - **Run As** → **Spring Boot App**
   - Check Eureka dashboard for registration

3. **Start Vehicle Service**
   - Right-click on `vehicle-service` project
   - **Run As** → **Spring Boot App**

4. **Start API Gateway**
   - Right-click on `api-gateway` project
   - **Run As** → **Spring Boot App**

### 6.2 Verify Services
1. **Eureka Dashboard**: http://localhost:8761
2. **API Gateway**: http://localhost:8080
3. **User Service**: http://localhost:8081
4. **Vehicle Service**: http://localhost:8082

## Step 7: Testing the Application

### 7.1 Test User Registration
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser",
    "password": "password123",
    "role": "CUSTOMER"
  }'
```

### 7.2 Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin",
    "password": "admin123"
  }'
```

## Step 8: Debugging and Troubleshooting

### 8.1 Common Issues

#### Port Conflicts
- Check if ports 8080, 8081, 8082, 8761 are available
- Change ports in application.yml if needed

#### Service Registration Issues
- Verify Eureka server is running
- Check network connectivity
- Review application.yml configurations

#### Database Connection Issues
- Verify database credentials
- Check database server status
- Review JDBC URL format

### 8.2 Eclipse Debugging
1. Set breakpoints in code
2. Right-click project → **Debug As** → **Spring Boot App**
3. Use Eclipse debugger features

### 8.3 Logging
1. Check Eclipse Console for logs
2. Configure logging levels in application.yml
3. Use Spring Boot Actuator endpoints for monitoring

## Step 9: Development Workflow

### 9.1 Making Changes
1. Modify code in Eclipse
2. Save files (auto-compilation)
3. Restart affected services
4. Test changes

### 9.2 Adding New Features
1. Create new branches in Git
2. Implement features in respective services
3. Test inter-service communication
4. Update API documentation

### 9.3 Database Schema Changes
1. Update entity classes
2. Use Hibernate DDL auto-update for development
3. Create migration scripts for production

## Step 10: Production Deployment

### 10.1 Build JAR Files
1. Right-click project → **Run As** → **Maven build**
2. Goals: `clean package`
3. JAR files created in `target/` directory

### 10.2 Docker Deployment
1. Build Docker images using provided Dockerfiles
2. Use docker-compose.yml for orchestration
3. Configure production databases

### 10.3 Cloud Deployment
1. Deploy to AWS/Azure/GCP
2. Use container orchestration (Kubernetes)
3. Configure load balancers and monitoring

## Additional Resources

### Eclipse Plugins
- **SonarLint**: Code quality analysis
- **EGit**: Git integration
- **Docker Tools**: Docker integration
- **Kubernetes Tools**: Kubernetes support

### Spring Boot Tools
- **Spring Boot Dashboard**: Manage multiple Spring Boot apps
- **Spring Boot DevTools**: Hot reloading
- **Actuator**: Production monitoring

### Testing Tools
- **JUnit 5**: Unit testing
- **Mockito**: Mocking framework
- **TestContainers**: Integration testing
- **Postman**: API testing

## Conclusion

This guide provides a complete setup for developing Spring Boot microservices in Eclipse IDE. Follow each step carefully, and you'll have a fully functional microservices architecture running locally.

For any issues, refer to the troubleshooting section or check the Spring Boot and Spring Cloud documentation.