package com.vehiclebooking.vehicleservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Vehicle name is required")
    @Size(max = 100, message = "Vehicle name must not exceed 100 characters")
    private String name;
    
    @Column(nullable = false)
    @NotBlank(message = "Vehicle type is required")
    private String type;
    
    @Column(nullable = false)
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @Column(nullable = false)
    @NotBlank(message = "Model is required")
    private String model;
    
    @Column(nullable = false)
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    private Integer year;
    
    @Column(name = "price_per_day", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Price per day is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal pricePerDay;
    
    @ElementCollection
    @CollectionTable(name = "vehicle_features", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "feature")
    private List<String> features;
    
    @Column(name = "fuel_type", nullable = false)
    @NotBlank(message = "Fuel type is required")
    private String fuelType;
    
    @Column(nullable = false)
    @NotBlank(message = "Transmission is required")
    private String transmission;
    
    @Column(name = "seating_capacity", nullable = false)
    @NotNull(message = "Seating capacity is required")
    @Min(value = 2, message = "Seating capacity must be at least 2")
    private Integer seatingCapacity;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(nullable = false)
    @NotNull(message = "Availability is required")
    @Min(value = 0, message = "Availability cannot be negative")
    private Integer availability;
    
    @Column(name = "total_stock", nullable = false)
    @NotNull(message = "Total stock is required")
    @Min(value = 0, message = "Total stock cannot be negative")
    private Integer totalStock;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Vehicle() {}
    
    public Vehicle(String name, String type, String brand, String model, Integer year, 
                  BigDecimal pricePerDay, String fuelType, String transmission, 
                  Integer seatingCapacity, Integer totalStock) {
        this.name = name;
        this.type = type;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.pricePerDay = pricePerDay;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.seatingCapacity = seatingCapacity;
        this.totalStock = totalStock;
        this.availability = totalStock;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }
    
    public BigDecimal getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(BigDecimal pricePerDay) { this.pricePerDay = pricePerDay; }
    
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
    
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    
    public Integer getSeatingCapacity() { return seatingCapacity; }
    public void setSeatingCapacity(Integer seatingCapacity) { this.seatingCapacity = seatingCapacity; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public Integer getAvailability() { return availability; }
    public void setAvailability(Integer availability) { this.availability = availability; }
    
    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}