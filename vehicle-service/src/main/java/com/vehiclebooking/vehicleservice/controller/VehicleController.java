package com.vehiclebooking.vehicleservice.controller;

import com.vehiclebooking.vehicleservice.dto.VehicleRequest;
import com.vehiclebooking.vehicleservice.dto.VehicleResponse;
import com.vehiclebooking.vehicleservice.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    
    @Autowired
    private VehicleService vehicleService;
    
    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        VehicleResponse vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(vehicle);
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<VehicleResponse>> getAvailableVehicles() {
        List<VehicleResponse> vehicles = vehicleService.getAvailableVehicles();
        return ResponseEntity.ok(vehicles);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<VehicleResponse>> searchVehicles(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        List<VehicleResponse> vehicles = vehicleService.searchVehicles(name, type, brand, minPrice, maxPrice);
        return ResponseEntity.ok(vehicles);
    }
    
    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleResponse vehicle = vehicleService.createVehicle(request);
        return new ResponseEntity<>(vehicle, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable Long id, 
                                                        @Valid @RequestBody VehicleRequest request) {
        VehicleResponse vehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(vehicle);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getVehicleStats() {
        Map<String, Long> stats = Map.of(
            "totalVehicles", vehicleService.getTotalVehicles(),
            "availableVehicles", vehicleService.getAvailableVehicleCount(),
            "totalStock", vehicleService.getTotalStock()
        );
        return ResponseEntity.ok(stats);
    }
}