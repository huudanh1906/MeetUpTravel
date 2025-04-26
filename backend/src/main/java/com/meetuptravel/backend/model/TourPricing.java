package com.meetuptravel.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "tour_pricing")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false, name = "customer_type")
    private String customerType; // adult, child 0-2, child 3-10, etc.

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false, name = "is_round_trip")
    private Boolean isRoundTrip = false;
}