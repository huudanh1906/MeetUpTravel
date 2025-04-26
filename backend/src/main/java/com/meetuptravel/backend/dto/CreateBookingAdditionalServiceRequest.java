package com.meetuptravel.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingAdditionalServiceRequest {

    @NotNull(message = "Service name is required")
    private String serviceName;

    private String serviceType;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity = 1;

    private Long additionalServiceId;
}