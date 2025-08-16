package com.vehiclebooking.vehicleservice.config;

import com.vehiclebooking.vehicleservice.entity.Vehicle;
import com.vehiclebooking.vehicleservice.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create sample vehicles if none exist
        if (vehicleRepository.count() == 0) {
            createSampleVehicles();
            System.out.println("Sample vehicles created successfully");
        }
    }
    
    private void createSampleVehicles() {
        // Toyota Camry
        Vehicle camry = new Vehicle();
        camry.setName("Toyota Camry 2024");
        camry.setType("Sedan");
        camry.setBrand("Toyota");
        camry.setModel("Camry");
        camry.setYear(2024);
        camry.setPricePerDay(new BigDecimal("85.00"));
        camry.setFeatures(Arrays.asList("AC", "GPS", "Bluetooth", "Backup Camera"));
        camry.setFuelType("Petrol");
        camry.setTransmission("Automatic");
        camry.setSeatingCapacity(5);
        camry.setImageUrl("https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg");
        camry.setTotalStock(10);
        camry.setAvailability(8);
        vehicleRepository.save(camry);
        
        // Honda CR-V
        Vehicle crv = new Vehicle();
        crv.setName("Honda CR-V 2024");
        crv.setType("SUV");
        crv.setBrand("Honda");
        crv.setModel("CR-V");
        crv.setYear(2024);
        crv.setPricePerDay(new BigDecimal("120.00"));
        crv.setFeatures(Arrays.asList("AC", "GPS", "AWD", "Sunroof", "Leather Seats"));
        crv.setFuelType("Petrol");
        crv.setTransmission("Automatic");
        crv.setSeatingCapacity(7);
        crv.setImageUrl("https://images.pexels.com/photos/1319551/pexels-photo-1319551.jpeg");
        crv.setTotalStock(8);
        crv.setAvailability(5);
        vehicleRepository.save(crv);
        
        // BMW X5
        Vehicle bmwX5 = new Vehicle();
        bmwX5.setName("BMW X5 2024");
        bmwX5.setType("SUV");
        bmwX5.setBrand("BMW");
        bmwX5.setModel("X5");
        bmwX5.setYear(2024);
        bmwX5.setPricePerDay(new BigDecimal("200.00"));
        bmwX5.setFeatures(Arrays.asList("AC", "GPS", "AWD", "Sunroof", "Leather Seats", "Premium Sound"));
        bmwX5.setFuelType("Petrol");
        bmwX5.setTransmission("Automatic");
        bmwX5.setSeatingCapacity(7);
        bmwX5.setImageUrl("https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg");
        bmwX5.setTotalStock(5);
        bmwX5.setAvailability(3);
        vehicleRepository.save(bmwX5);
        
        // Ford Mustang
        Vehicle mustang = new Vehicle();
        mustang.setName("Ford Mustang 2024");
        mustang.setType("Coupe");
        mustang.setBrand("Ford");
        mustang.setModel("Mustang");
        mustang.setYear(2024);
        mustang.setPricePerDay(new BigDecimal("150.00"));
        mustang.setFeatures(Arrays.asList("AC", "GPS", "Bluetooth", "Sport Mode", "Premium Sound"));
        mustang.setFuelType("Petrol");
        mustang.setTransmission("Manual");
        mustang.setSeatingCapacity(4);
        mustang.setImageUrl("https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg");
        mustang.setTotalStock(6);
        mustang.setAvailability(4);
        vehicleRepository.save(mustang);
        
        // Tesla Model 3
        Vehicle tesla = new Vehicle();
        tesla.setName("Tesla Model 3 2024");
        tesla.setType("Sedan");
        tesla.setBrand("Tesla");
        tesla.setModel("Model 3");
        tesla.setYear(2024);
        tesla.setPricePerDay(new BigDecimal("180.00"));
        tesla.setFeatures(Arrays.asList("Autopilot", "GPS", "Premium Sound", "Supercharging", "Glass Roof"));
        tesla.setFuelType("Electric");
        tesla.setTransmission("Automatic");
        tesla.setSeatingCapacity(5);
        tesla.setImageUrl("https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg");
        tesla.setTotalStock(4);
        tesla.setAvailability(2);
        vehicleRepository.save(tesla);
    }
}