package com.vehiclebooking.vehicleservice.dto;

import com.vehiclebooking.vehicleservice.entity.Booking;
import com.vehiclebooking.vehicleservice.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {
    
    private Long id;
    private Long customerId;
    private String customerName;
    private Long vehicleId;
    private String vehicleName;
    private Long branchId;
    private String branchName;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime bookingDate;
    private LocalDateTime approvedDate;
    private String branchAdminNotes;
    
    // Constructors
    public BookingResponse() {}
    
    public BookingResponse(Booking booking) {
        this.id = booking.getId();
        this.customerId = booking.getCustomerId();
        this.customerName = booking.getCustomerName();
        this.vehicleId = booking.getVehicleId();
        this.vehicleName = booking.getVehicleName();
        this.branchId = booking.getBranchId();
        this.branchName = booking.getBranchName();
        this.startDate = booking.getStartDate();
        this.endDate = booking.getEndDate();
        this.totalAmount = booking.getTotalAmount();
        this.status = booking.getStatus();
        this.bookingDate = booking.getBookingDate();
        this.approvedDate = booking.getApprovedDate();
        this.branchAdminNotes = booking.getBranchAdminNotes();
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