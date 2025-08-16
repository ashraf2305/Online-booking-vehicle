package com.vehiclebooking.userservice.controller;

import com.vehiclebooking.userservice.dto.LoginRequest;
import com.vehiclebooking.userservice.dto.UserResponse;
import com.vehiclebooking.userservice.security.JwtTokenProvider;
import com.vehiclebooking.userservice.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUserId(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = tokenProvider.generateToken(userDetails);
        
        UserResponse user = userService.getUserByUserId(request.getUserId());
        
        Map<String, Object> response = Map.of(
            "token", token,
            "user", user,
            "message", "Login successful"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.substring(7); // Remove "Bearer " prefix
        
        if (tokenProvider.validateToken(jwt)) {
            String userId = tokenProvider.getUserIdFromToken(jwt);
            UserResponse user = userService.getUserByUserId(userId);
            
            Map<String, Object> response = Map.of(
                "valid", true,
                "user", user
            );
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.ok(Map.of("valid", false));
    }
}