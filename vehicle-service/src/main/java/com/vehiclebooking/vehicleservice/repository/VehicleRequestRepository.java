package com.vehiclebooking.vehicleservice.repository;

import com.vehiclebooking.vehicleservice.entity.RequestStatus;
import com.vehiclebooking.vehicleservice.entity.VehicleRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRequestRepository extends JpaRepository<VehicleRequest, Long> {
    
    List<VehicleRequest> findByBranchId(Long branchId);
    
    List<VehicleRequest> findByStatus(RequestStatus status);
    
    List<VehicleRequest> findByBranchIdAndStatus(Long branchId, RequestStatus status);
    
    List<VehicleRequest> findByVehicleId(Long vehicleId);
    
    @Query("SELECT COUNT(vr) FROM VehicleRequest vr WHERE vr.status = :status")
    long countByStatus(@Param("status") RequestStatus status);
    
    @Query("SELECT vr FROM VehicleRequest vr WHERE vr.branchId = :branchId ORDER BY vr.requestDate DESC")
    List<VehicleRequest> findByBranchIdOrderByRequestDateDesc(@Param("branchId") Long branchId);
}