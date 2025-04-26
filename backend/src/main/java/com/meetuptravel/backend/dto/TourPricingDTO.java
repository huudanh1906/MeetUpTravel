package com.meetuptravel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourPricingDTO {
    private Long id;
    private String customerType;
    private BigDecimal price;
    private Boolean isRoundTrip;
}