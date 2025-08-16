package com.vehiclebooking.vehicleservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public class VehicleRequest {
    
    @NotBlank(message = "Vehicle name is required")
    @Size(max = 100, message = "Vehicle name must not exceed 100 characters")
    private String name;
    
    @NotBlank(message = "Vehicle type is required")
    private String type;
    
    @NotBlank(message = "Brand is required")
    private String brand;
    
    @NotBlank(message = "Model is required")
    private String model;
    
    @NotNull(message = "Year is required")
    @Min(value = 2000, message = "Year must be 2000 or later")
    private Integer year;
    
    @NotNull(message = "Price per day is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal pricePerDay;
    
    private List<String> features;
    
    @NotBlank(message = "Fuel type is required")
    private String fuelType;
    
    @NotBlank(message = "Transmission is required")
    private String transmission;
    
    @NotNull(message = "Seating capacity is required")
    @Min(value = 2, message = "Seating capacity must be at least 2")
    private Integer seatingCapacity;
    
    private String imageUrl;
    
    @NotNull(message = "Total stock is required")
    @Min(value = 0, message = "Total stock cannot be negative")
    private Integer totalStock;
    
    // Constructors
    public VehicleRequest() {}
    
    // Getters and Setters
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
    
    public Integer getTotalStock() { return totalStock; }
    public void setTotalStock(Integer totalStock) { this.totalStock = totalStock; }
}