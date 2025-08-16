package com.vehiclebooking.vehicleservice.repository;

import com.vehiclebooking.vehicleservice.entity.Booking;
import com.vehiclebooking.vehicleservice.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByBranchId(Long branchId);
    
    List<Booking> findByVehicleId(Long vehicleId);
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByBranchIdAndStatus(Long branchId, BookingStatus status);
    
    List<Booking> findByCustomerIdAndStatus(Long customerId, BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.vehicleId = :vehicleId AND " +
           "b.status IN ('APPROVED', 'IN_PROCESS') AND " +
           "((b.startDate <= :endDate) AND (b.endDate >= :startDate))")
    List<Booking> findConflictingBookings(@Param("vehicleId") Long vehicleId,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.branchId = :branchId ORDER BY b.bookingDate DESC")
    List<Booking> findByBranchIdOrderByBookingDateDesc(@Param("branchId") Long branchId);
    
    @Query("SELECT b FROM Booking b WHERE b.customerId = :customerId ORDER BY b.bookingDate DESC")
    List<Booking> findByCustomerIdOrderByBookingDateDesc(@Param("customerId") Long customerId);
}