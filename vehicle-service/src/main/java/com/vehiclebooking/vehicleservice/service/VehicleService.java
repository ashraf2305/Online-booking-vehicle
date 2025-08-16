package com.vehiclebooking.vehicleservice.service;

import com.vehiclebooking.vehicleservice.dto.VehicleRequest;
import com.vehiclebooking.vehicleservice.dto.VehicleResponse;
import com.vehiclebooking.vehicleservice.entity.Vehicle;
import com.vehiclebooking.vehicleservice.exception.VehicleNotFoundException;
import com.vehiclebooking.vehicleservice.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleService {
    
    @Autowired
    private VehicleRepository vehicleRepository;
    
    public List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(VehicleResponse::new)
                .collect(Collectors.toList());
    }
    
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));
        return new VehicleResponse(vehicle);
    }
    
    public List<VehicleResponse> getAvailableVehicles() {
        return vehicleRepository.findAvailableVehicles().stream()
                .map(VehicleResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<VehicleResponse> searchVehicles(String name, String type, String brand, 
                                               BigDecimal minPrice, BigDecimal maxPrice) {
        return vehicleRepository.findVehiclesWithFilters(name, type, brand, minPrice, maxPrice).stream()
                .map(VehicleResponse::new)
                .collect(Collectors.toList());
    }
    
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        mapRequestToEntity(request, vehicle);
        vehicle.setAvailability(request.getTotalStock()); // Initially all stock is available
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return new VehicleResponse(savedVehicle);
    }
    
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found with id: " + id));
        
        mapRequestToEntity(request, vehicle);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return new VehicleResponse(savedVehicle);
    }
    
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new VehicleNotFoundException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }
    
    public long getTotalVehicles() {
        return vehicleRepository.count();
    }
    
    public long getAvailableVehicleCount() {
        return vehicleRepository.countAvailableVehicles();
    }
    
    public long getTotalStock() {
        return vehicleRepository.getTotalVehicleStock();
    }
    
    private void mapRequestToEntity(VehicleRequest request, Vehicle vehicle) {
        vehicle.setName(request.getName());
        vehicle.setType(request.getType());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setPricePerDay(request.getPricePerDay());
        vehicle.setFeatures(request.getFeatures());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setSeatingCapacity(request.getSeatingCapacity());
        vehicle.setImageUrl(request.getImageUrl());
        vehicle.setTotalStock(request.getTotalStock());
        
        // If this is an update and availability wasn't set, maintain current availability
        if (vehicle.getAvailability() == null) {
            vehicle.setAvailability(request.getTotalStock());
        }
    }
}