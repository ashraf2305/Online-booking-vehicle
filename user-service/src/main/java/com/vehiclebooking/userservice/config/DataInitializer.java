package com.vehiclebooking.userservice.config;

import com.vehiclebooking.userservice.entity.User;
import com.vehiclebooking.userservice.entity.UserRole;
import com.vehiclebooking.userservice.entity.UserStatus;
import com.vehiclebooking.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUserId("admin")) {
            User admin = new User();
            admin.setUserId("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setStatus(UserStatus.APPROVED);
            admin.setFullName("System Administrator");
            admin.setEmail("admin@vehiclebooking.com");
            
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }
    }
}