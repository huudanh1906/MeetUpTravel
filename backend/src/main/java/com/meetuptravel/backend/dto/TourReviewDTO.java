package com.meetuptravel.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourReviewDTO {
    private Long id;
    private String platform;
    private Float rating;
    private String comment;
    private String reviewerName;
    private LocalDate reviewDate;
}