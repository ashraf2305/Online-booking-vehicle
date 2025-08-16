package com.vehiclebooking.vehicleservice.dto;

import com.vehiclebooking.vehicleservice.entity.RequestStatus;
import com.vehiclebooking.vehicleservice.entity.VehicleRequest;

import java.time.LocalDateTime;

public class VehicleRequestResponse {
    
    private Long id;
    private Long branchId;
    private String branchName;
    private Long vehicleId;
    private String vehicleName;
    private Integer requestedQuantity;
    private Integer approvedQuantity;
    private RequestStatus status;
    private LocalDateTime requestDate;
    private LocalDateTime approvedDate;
    private String adminNotes;
    
    // Constructors
    public VehicleRequestResponse() {}
    
    public VehicleRequestResponse(VehicleRequest request) {
        this.id = request.getId();
        this.branchId = request.getBranchId();
        this.branchName = request.getBranchName();
        this.vehicleId = request.getVehicleId();
        this.vehicleName = request.getVehicleName();
        this.requestedQuantity = request.getRequestedQuantity();
        this.approvedQuantity = request.getApprovedQuantity();
        this.status = request.getStatus();
        this.requestDate = request.getRequestDate();
        this.approvedDate = request.getApprovedDate();
        this.adminNotes = request.getAdminNotes();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    
    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }
    
    public Integer getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Integer requestedQuantity) { this.requestedQuantity = requestedQuantity; }
    
    public Integer getApprovedQuantity() { return approvedQuantity; }
    public void setApprovedQuantity(Integer approvedQuantity) { this.approvedQuantity = approvedQuantity; }
    
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    
    public LocalDateTime getRequestDate() { return requestDate; }
    public void setRequestDate(LocalDateTime requestDate) { this.requestDate = requestDate; }
    
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
    
    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}