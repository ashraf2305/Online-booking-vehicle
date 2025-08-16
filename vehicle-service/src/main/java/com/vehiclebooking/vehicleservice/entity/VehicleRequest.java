package com.vehiclebooking.vehicleservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_requests")
public class VehicleRequest {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "branch_id", nullable = false)
    @NotNull(message = "Branch ID is required")
    private Long branchId;
    
    @Column(name = "branch_name", nullable = false)
    @NotBlank(message = "Branch name is required")
    private String branchName;
    
    @Column(name = "vehicle_id", nullable = false)
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @Column(name = "vehicle_name", nullable = false)
    @NotBlank(message = "Vehicle name is required")
    private String vehicleName;
    
    @Column(name = "requested_quantity", nullable = false)
    @NotNull(message = "Requested quantity is required")
    @Min(value = 1, message = "Requested quantity must be at least 1")
    private Integer requestedQuantity;
    
    @Column(name = "approved_quantity")
    private Integer approvedQuantity = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;
    
    @Column(name = "request_date", nullable = false)
    private LocalDateTime requestDate = LocalDateTime.now();
    
    @Column(name = "approved_date")
    private LocalDateTime approvedDate;
    
    @Column(name = "admin_notes")
    private String adminNotes;
    
    // Constructors
    public VehicleRequest() {}
    
    public VehicleRequest(Long branchId, String branchName, Long vehicleId, 
                         String vehicleName, Integer requestedQuantity) {
        this.branchId = branchId;
        this.branchName = branchName;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.requestedQuantity = requestedQuantity;
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