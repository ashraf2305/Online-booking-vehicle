package com.vehiclebooking.vehicleservice.dto;

import com.vehiclebooking.vehicleservice.entity.Vehicle;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class VehicleResponse {
    
    private Long id;
    private String name;
    private String type;
    private String brand;
    private String model;
    private Integer year;
    private BigDecimal pricePerDay;
    private List<String> features;
    private String fuelType;
    private String transmission;
    private Integer seatingCapacity;
    private String imageUrl;
    private Integer availability;
    private Integer totalStock;
    private LocalDateTime createdAt;
    
    // Constructors
    public VehicleResponse() {}
    
    public VehicleResponse(Vehicle vehicle) {
        this.id = vehicle.getId();
        this.name = vehicle.getName();
        this.type = vehicle.getType();
        this.brand = vehicle.getBrand();
        this.model = vehicle.getModel();
        this.year = vehicle.getYear();
        this.pricePerDay = vehicle.getPricePerDay();
        this.features = vehicle.getFeatures();
        this.fuelType = vehicle.getFuelType();
        this.transmission = vehicle.getTransmission();
        this.seatingCapacity = vehicle.getSeatingCapacity();
        this.imageUrl = vehicle.getImageUrl();
        this.availability = vehicle.getAvailability();
        this.totalStock = vehicle.getTotalStock();
        this.createdAt = vehicle.getCreatedAt();
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
}