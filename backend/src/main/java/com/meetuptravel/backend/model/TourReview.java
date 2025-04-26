package com.meetuptravel.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tour_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false)
    private String platform; // Tripadvisor, Google, etc.

    @Column(nullable = false)
    private Float rating;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "reviewer_name")
    private String reviewerName;

    @Column(name = "review_date")
    private LocalDate reviewDate;
}