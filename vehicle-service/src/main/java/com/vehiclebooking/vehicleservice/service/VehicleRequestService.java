package com.vehiclebooking.vehicleservice.service;

import com.vehiclebooking.vehicleservice.dto.VehicleRequestDto;
import com.vehiclebooking.vehicleservice.dto.VehicleRequestResponse;
import com.vehiclebooking.vehicleservice.entity.RequestStatus;
import com.vehiclebooking.vehicleservice.entity.VehicleRequest;
import com.vehiclebooking.vehicleservice.exception.VehicleRequestNotFoundException;
import com.vehiclebooking.vehicleservice.repository.VehicleRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleRequestService {
    
    @Autowired
    private VehicleRequestRepository vehicleRequestRepository;
    
    public List<VehicleRequestResponse> getAllRequests() {
        return vehicleRequestRepository.findAll().stream()
                .map(VehicleRequestResponse::new)
                .collect(Collectors.toList());
    }
    
    public VehicleRequestResponse getRequestById(Long id) {
        VehicleRequest request = vehicleRequestRepository.findById(id)
                .orElseThrow(() -> new VehicleRequestNotFoundException("Vehicle request not found with id: " + id));
        return new VehicleRequestResponse(request);
    }
    
    public List<VehicleRequestResponse> getRequestsByBranchId(Long branchId) {
        return vehicleRequestRepository.findByBranchIdOrderByRequestDateDesc(branchId).stream()
                .map(VehicleRequestResponse::new)
                .collect(Collectors.toList());
    }
    
    public VehicleRequestResponse createRequest(VehicleRequestDto requestDto) {
        VehicleRequest request = new VehicleRequest();
        request.setBranchId(requestDto.getBranchId());
        request.setBranchName(requestDto.getBranchName());
        request.setVehicleId(requestDto.getVehicleId());
        request.setVehicleName(requestDto.getVehicleName());
        request.setRequestedQuantity(requestDto.getRequestedQuantity());
        request.setStatus(RequestStatus.PENDING);
        
        VehicleRequest savedRequest = vehicleRequestRepository.save(request);
        return new VehicleRequestResponse(savedRequest);
    }
    
    public VehicleRequestResponse approveRequest(Long id, Integer approvedQuantity, String adminNotes) {
        VehicleRequest request = vehicleRequestRepository.findById(id)
                .orElseThrow(() -> new VehicleRequestNotFoundException("Vehicle request not found with id: " + id));
        
        // Determine the final approved quantity
        int finalApprovedQuantity = approvedQuantity != null ? approvedQuantity : request.getRequestedQuantity();
        
        // Determine status based on approved vs requested quantity
        RequestStatus status;
        if (finalApprovedQuantity == 0) {
            status = RequestStatus.REJECTED;
        } else if (finalApprovedQuantity < request.getRequestedQuantity()) {
            status = RequestStatus.PARTIALLY_APPROVED;
        } else {
            status = RequestStatus.APPROVED;
        }
        
        request.setApprovedQuantity(finalApprovedQuantity);
        request.setStatus(status);
        request.setApprovedDate(LocalDateTime.now());
        request.setAdminNotes(adminNotes);
        
        VehicleRequest savedRequest = vehicleRequestRepository.save(request);
        return new VehicleRequestResponse(savedRequest);
    }
    
    public VehicleRequestResponse rejectRequest(Long id, String adminNotes) {
        VehicleRequest request = vehicleRequestRepository.findById(id)
                .orElseThrow(() -> new VehicleRequestNotFoundException("Vehicle request not found with id: " + id));
        
        request.setStatus(RequestStatus.REJECTED);
        request.setAdminNotes(adminNotes);
        
        VehicleRequest savedRequest = vehicleRequestRepository.save(request);
        return new VehicleRequestResponse(savedRequest);
    }
    
    public void deleteRequest(Long id) {
        if (!vehicleRequestRepository.existsById(id)) {
            throw new VehicleRequestNotFoundException("Vehicle request not found with id: " + id);
        }
        vehicleRequestRepository.deleteById(id);
    }
}