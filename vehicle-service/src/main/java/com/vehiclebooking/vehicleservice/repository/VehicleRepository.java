package com.vehiclebooking.vehicleservice.repository;

import com.vehiclebooking.vehicleservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    List<Vehicle> findByType(String type);
    
    List<Vehicle> findByBrand(String brand);
    
    List<Vehicle> findByAvailabilityGreaterThan(Integer availability);
    
    @Query("SELECT v FROM Vehicle v WHERE v.availability > 0")
    List<Vehicle> findAvailableVehicles();
    
    @Query("SELECT v FROM Vehicle v WHERE " +
           "(:name IS NULL OR LOWER(v.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
           "(:type IS NULL OR v.type = :type) AND " +
           "(:brand IS NULL OR LOWER(v.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:minPrice IS NULL OR v.pricePerDay >= :minPrice) AND " +
           "(:maxPrice IS NULL OR v.pricePerDay <= :maxPrice) AND " +
           "v.availability > 0")
    List<Vehicle> findVehiclesWithFilters(@Param("name") String name,
                                         @Param("type") String type,
                                         @Param("brand") String brand,
                                         @Param("minPrice") BigDecimal minPrice,
                                         @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.availability > 0")
    long countAvailableVehicles();
    
    @Query("SELECT SUM(v.totalStock) FROM Vehicle v")
    long getTotalVehicleStock();
    
    @Query("SELECT SUM(v.availability) FROM Vehicle v")
    long getTotalAvailableVehicles();
}