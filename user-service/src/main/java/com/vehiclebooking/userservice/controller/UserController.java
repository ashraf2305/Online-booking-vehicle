package com.vehiclebooking.userservice.controller;

import com.vehiclebooking.userservice.dto.ProfileUpdateRequest;
import com.vehiclebooking.userservice.dto.UserRegistrationRequest;
import com.vehiclebooking.userservice.dto.UserResponse;
import com.vehiclebooking.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/userId/{userId}")
    public ResponseEntity<UserResponse> getUserByUserId(@PathVariable String userId) {
        UserResponse response = userService.getUserByUserId(userId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingUsers() {
        List<UserResponse> users = userService.getPendingUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/branch-admins")
    public ResponseEntity<List<UserResponse>> getBranchAdmins() {
        List<UserResponse> users = userService.getBranchAdmins();
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> approveUser(@PathVariable Long id) {
        UserResponse response = userService.approveUser(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> rejectUser(@PathVariable Long id) {
        UserResponse response = userService.rejectUser(id);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}/profile")
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #id")
    public ResponseEntity<UserResponse> updateProfile(@PathVariable Long id, 
                                                     @Valid @RequestBody ProfileUpdateRequest request) {
        UserResponse response = userService.updateProfile(id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUserStats() {
        Map<String, Long> stats = Map.of(
            "totalUsers", userService.getTotalUsers(),
            "pendingApprovals", userService.getPendingApprovals(),
            "activeUsers", userService.getActiveUsers(),
            "branchAdmins", userService.getBranchAdminCount(),
            "customers", userService.getCustomerCount()
        );
        return ResponseEntity.ok(stats);
    }
}