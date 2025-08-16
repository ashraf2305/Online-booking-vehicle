#!/bin/bash

echo "Building Vehicle Booking System Microservices..."

# Build Eureka Server
echo "Building Eureka Server..."
cd eureka-server
mvn clean package -DskipTests
cd ..

# Build User Service
echo "Building User Service..."
cd user-service
mvn clean package -DskipTests
cd ..

# Build Vehicle Service
echo "Building Vehicle Service..."
cd vehicle-service
mvn clean package -DskipTests
cd ..

# Build API Gateway
echo "Building API Gateway..."
cd api-gateway
mvn clean package -DskipTests
cd ..

echo "All services built successfully!"
echo "Run 'docker-compose up --build' to start the system"