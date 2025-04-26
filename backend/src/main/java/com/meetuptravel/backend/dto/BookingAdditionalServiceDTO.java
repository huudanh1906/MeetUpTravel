package com.meetuptravel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingAdditionalServiceDTO {
    private Long id;
    private Long bookingId;
    private String serviceName;
    private String serviceType;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
}