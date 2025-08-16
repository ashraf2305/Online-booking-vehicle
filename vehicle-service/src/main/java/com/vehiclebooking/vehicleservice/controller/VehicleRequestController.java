package com.vehiclebooking.vehicleservice.controller;

import com.vehiclebooking.vehicleservice.dto.VehicleRequestDto;
import com.vehiclebooking.vehicleservice.dto.VehicleRequestResponse;
import com.vehiclebooking.vehicleservice.service.VehicleRequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
public class VehicleRequestController {
    
    @Autowired
    private VehicleRequestService vehicleRequestService;
    
    @GetMapping
    public ResponseEntity<List<VehicleRequestResponse>> getAllRequests() {
        List<VehicleRequestResponse> requests = vehicleRequestService.getAllRequests();
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<VehicleRequestResponse> getRequestById(@PathVariable Long id) {
        VehicleRequestResponse request = vehicleRequestService.getRequestById(id);
        return ResponseEntity.ok(request);
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<VehicleRequestResponse>> getBranchRequests(@PathVariable Long branchId) {
        List<VehicleRequestResponse> requests = vehicleRequestService.getRequestsByBranchId(branchId);
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping
    public ResponseEntity<VehicleRequestResponse> createRequest(@Valid @RequestBody VehicleRequestDto request) {
        VehicleRequestResponse response = vehicleRequestService.createRequest(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<VehicleRequestResponse> approveRequest(@PathVariable Long id,
                                                               @RequestBody Map<String, Object> body) {
        Integer approvedQuantity = body.get("approvedQuantity") != null 
            ? Integer.valueOf(body.get("approvedQuantity").toString()) 
            : null;
        String adminNotes = (String) body.get("adminNotes");
        
        VehicleRequestResponse response = vehicleRequestService.approveRequest(id, approvedQuantity, adminNotes);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/partial-approve")
    public ResponseEntity<VehicleRequestResponse> partialApproveRequest(@PathVariable Long id,
                                                                       @RequestBody Map<String, Object> body) {
        Integer approvedQuantity = Integer.valueOf(body.get("approvedQuantity").toString());
        String adminNotes = (String) body.get("adminNotes");
        
        if (approvedQuantity == null || approvedQuantity <= 0) {
            throw new IllegalArgumentException("Approved quantity must be greater than 0 for partial approval");
        }
        
        VehicleRequestResponse response = vehicleRequestService.approveRequest(id, approvedQuantity, adminNotes);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<VehicleRequestResponse> rejectRequest(@PathVariable Long id,
                                                              @RequestBody Map<String, String> notes) {
        String adminNotes = notes.get("adminNotes");
        VehicleRequestResponse response = vehicleRequestService.rejectRequest(id, adminNotes);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        vehicleRequestService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}