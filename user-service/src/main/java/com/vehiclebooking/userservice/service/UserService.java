package com.vehiclebooking.userservice.service;

import com.vehiclebooking.userservice.dto.ProfileUpdateRequest;
import com.vehiclebooking.userservice.dto.UserRegistrationRequest;
import com.vehiclebooking.userservice.dto.UserResponse;
import com.vehiclebooking.userservice.entity.User;
import com.vehiclebooking.userservice.entity.UserRole;
import com.vehiclebooking.userservice.entity.UserStatus;
import com.vehiclebooking.userservice.exception.UserAlreadyExistsException;
import com.vehiclebooking.userservice.exception.UserNotFoundException;
import com.vehiclebooking.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public UserResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByUserId(request.getUserId())) {
            throw new UserAlreadyExistsException("User ID already exists: " + request.getUserId());
        }
        
        User user = new User();
        user.setUserId(request.getUserId());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setStatus(UserStatus.PENDING);
        
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return new UserResponse(user);
    }
    
    public UserResponse getUserByUserId(String userId) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with userId: " + userId));
        return new UserResponse(user);
    }
    
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getPendingUsers() {
        return userRepository.findPendingNonAdminUsers(UserStatus.PENDING).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getBranchAdmins() {
        return userRepository.findByRoleAndStatus(UserRole.BRANCH_ADMIN, UserStatus.APPROVED).stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    public UserResponse approveUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setStatus(UserStatus.APPROVED);
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public UserResponse rejectUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setStatus(UserStatus.REJECTED);
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public UserResponse updateProfile(Long id, ProfileUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        
        if (user.getRole() == UserRole.CUSTOMER) {
            user.setLicenseNumber(request.getLicenseNumber());
        } else if (user.getRole() == UserRole.BRANCH_ADMIN) {
            user.setBranchName(request.getBranchName());
            user.setBranchCode(request.getBranchCode());
            user.setManagerName(request.getManagerName());
        }
        
        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser);
    }
    
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    public long getTotalUsers() {
        return userRepository.count();
    }
    
    public long getPendingApprovals() {
        return userRepository.countByStatus(UserStatus.PENDING);
    }
    
    public long getActiveUsers() {
        return userRepository.countByStatus(UserStatus.APPROVED);
    }
    
    public long getBranchAdminCount() {
        return userRepository.countByRoleAndStatus(UserRole.BRANCH_ADMIN, UserStatus.APPROVED);
    }
    
    public long getCustomerCount() {
        return userRepository.countByRoleAndStatus(UserRole.CUSTOMER, UserStatus.APPROVED);
    }
}