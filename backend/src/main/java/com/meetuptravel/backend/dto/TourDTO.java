package com.meetuptravel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourDTO {
    private Long id;
    private String title;
    private String description;
    private String scheduleDescription;
    private BigDecimal price;
    private int duration;
    private String imageUrl;
    private int minPax;
    private int maxPax;
    private float rating;
    private Set<String> images;
    private Set<String> highlights;
    private Set<String> includedServices;
    private Set<String> excludedServices;
    private Set<String> pickupPoints;
    private Set<String> categories;
    private Set<AdditionalServiceDTO> additionalServices;
    private Set<TourPricingDTO> pricingOptions;
    private Set<TourReviewDTO> reviews;
    private boolean featured;
    private Set<String> availableGuides;
    private String youtubeUrl;
}