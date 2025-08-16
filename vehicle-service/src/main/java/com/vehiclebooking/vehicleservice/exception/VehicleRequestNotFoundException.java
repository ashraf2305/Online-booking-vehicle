package com.vehiclebooking.vehicleservice.exception;

public class VehicleRequestNotFoundException extends RuntimeException {
    public VehicleRequestNotFoundException(String message) {
        super(message);
    }
}