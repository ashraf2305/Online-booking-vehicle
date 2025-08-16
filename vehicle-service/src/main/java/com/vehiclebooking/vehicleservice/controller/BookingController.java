package com.vehiclebooking.vehicleservice.controller;

import com.vehiclebooking.vehicleservice.dto.BookingRequest;
import com.vehiclebooking.vehicleservice.dto.BookingResponse;
import com.vehiclebooking.vehicleservice.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        List<BookingResponse> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<BookingResponse>> getCustomerBookings(@PathVariable Long customerId) {
        List<BookingResponse> bookings = bookingService.getBookingsByCustomerId(customerId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<BookingResponse>> getBranchBookings(@PathVariable Long branchId) {
        List<BookingResponse> bookings = bookingService.getBookingsByBranchId(branchId);
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        BookingResponse booking = bookingService.createBooking(request);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}/approve")
    public ResponseEntity<BookingResponse> approveBooking(@PathVariable Long id,
                                                         @RequestBody Map<String, String> notes) {
        String branchAdminNotes = notes.get("branchAdminNotes");
        BookingResponse booking = bookingService.approveBooking(id, branchAdminNotes);
        return ResponseEntity.ok(booking);
    }
    
    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(@PathVariable Long id,
                                                        @RequestBody Map<String, String> notes) {
        String branchAdminNotes = notes.get("branchAdminNotes");
        BookingResponse booking = bookingService.rejectBooking(id, branchAdminNotes);
        return ResponseEntity.ok(booking);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}