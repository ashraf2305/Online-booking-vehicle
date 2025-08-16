package com.vehiclebooking.vehicleservice.service;

import com.vehiclebooking.vehicleservice.dto.BookingRequest;
import com.vehiclebooking.vehicleservice.dto.BookingResponse;
import com.vehiclebooking.vehicleservice.entity.Booking;
import com.vehiclebooking.vehicleservice.entity.BookingStatus;
import com.vehiclebooking.vehicleservice.exception.BookingNotFoundException;
import com.vehiclebooking.vehicleservice.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }
    
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        return new BookingResponse(booking);
    }
    
    public List<BookingResponse> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customerId).stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<BookingResponse> getBookingsByBranchId(Long branchId) {
        return bookingRepository.findByBranchIdOrderByBookingDateDesc(branchId).stream()
                .map(BookingResponse::new)
                .collect(Collectors.toList());
    }
    
    public BookingResponse createBooking(BookingRequest request) {
        Booking booking = new Booking();
        booking.setCustomerId(request.getCustomerId());
        booking.setCustomerName(request.getCustomerName());
        booking.setVehicleId(request.getVehicleId());
        booking.setVehicleName(request.getVehicleName());
        booking.setBranchId(request.getBranchId());
        booking.setBranchName(request.getBranchName());
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(BookingStatus.PENDING);
        
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }
    
    public BookingResponse approveBooking(Long id, String branchAdminNotes) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(BookingStatus.APPROVED);
        booking.setApprovedDate(LocalDateTime.now());
        booking.setBranchAdminNotes(branchAdminNotes);
        
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }
    
    public BookingResponse rejectBooking(Long id, String branchAdminNotes) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BookingNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(BookingStatus.REJECTED);
        booking.setBranchAdminNotes(branchAdminNotes);
        
        Booking savedBooking = bookingRepository.save(booking);
        return new BookingResponse(savedBooking);
    }
    
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new BookingNotFoundException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
    }
}