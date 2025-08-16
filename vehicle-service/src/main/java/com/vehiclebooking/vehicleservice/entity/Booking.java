package com.vehiclebooking.vehicleservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @Column(name = "customer_name", nullable = false)
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @Column(name = "vehicle_id", nullable = false)
    @NotNull(message = "Vehicle ID is required")
    private Long vehicleId;
    
    @Column(name = "vehicle_name", nullable = false)
    @NotBlank(message = "Vehicle name is required")
    private String vehicleName;
    
    @Column(name = "branch_id", nullable = false)
    @NotNull(message = "Branch ID is required")
    private Long branchId;
    
    @Column(name = "branch_name", nullable = false)
    @NotBlank(message = "Branch name is required")
    private String branchName;
    
    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    @NotNull(message = "End date is required")
    private LocalDate endDate;
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate = LocalDateTime.now();
    
    @Column(name = "approved_date")
    private LocalDateTime approvedDate;
    
    @Column(name = "branch_admin_notes")
    private String branchAdminNotes;
    
    // Constructors
    public Booking() {}
    
    public Booking(Long customerId, String customerName, Long vehicleId, String vehicleName,
                  Long branchId, String branchName, LocalDate startDate, LocalDate endDate,
                  BigDecimal totalAmount) {
        this.customerId = customerId;
        this.customerName = customerName;
        this.vehicleId = vehicleId;
        this.vehicleName = vehicleName;
        this.branchId = branchId;
        this.branchName = branchName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalAmount = totalAmount;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public Long getVehicleId() { return vehicleId; }
    public void setVehicleId(Long vehicleId) { this.vehicleId = vehicleId; }
    
    public String getVehicleName() { return vehicleName; }
    public void setVehicleName(String vehicleName) { this.vehicleName = vehicleName; }
    
    public Long getBranchId() { return branchId; }
    public void setBranchId(Long branchId) { this.branchId = branchId; }
    
    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    
    public LocalDateTime getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDateTime bookingDate) { this.bookingDate = bookingDate; }
    
    public LocalDateTime getApprovedDate() { return approvedDate; }
    public void setApprovedDate(LocalDateTime approvedDate) { this.approvedDate = approvedDate; }
    
    public String getBranchAdminNotes() { return branchAdminNotes; }
    public void setBranchAdminNotes(String branchAdminNotes) { this.branchAdminNotes = branchAdminNotes; }
}