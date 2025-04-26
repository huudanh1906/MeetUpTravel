package com.meetuptravel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingPricingOptionDTO {
    private Long id;
    private Long pricingOptionId;
    private String customerType;
    private boolean isRoundTrip;
    private int quantity;
    private BigDecimal price;
    private BigDecimal subtotal;
}