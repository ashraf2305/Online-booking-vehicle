package com.vehiclebooking.userservice.repository;

import com.vehiclebooking.userservice.entity.User;
import com.vehiclebooking.userservice.entity.UserRole;
import com.vehiclebooking.userservice.entity.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUserId(String userId);
    
    boolean existsByUserId(String userId);
    
    boolean existsByEmail(String email);
    
    List<User> findByStatus(UserStatus status);
    
    List<User> findByRole(UserRole role);
    
    List<User> findByRoleAndStatus(UserRole role, UserStatus status);
    
    @Query("SELECT u FROM User u WHERE u.status = :status AND u.role != 'ADMIN'")
    List<User> findPendingNonAdminUsers(@Param("status") UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.status = :status")
    long countByStatus(@Param("status") UserStatus status);
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.status = :status")
    long countByRoleAndStatus(@Param("role") UserRole role, @Param("status") UserStatus status);
}