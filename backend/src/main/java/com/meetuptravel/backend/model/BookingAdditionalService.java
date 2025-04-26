package com.meetuptravel.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "booking_additional_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingAdditionalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "additional_service_id")
    private AdditionalService additionalService;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private String serviceType;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private int quantity = 1;

    @Column(nullable = false)
    private BigDecimal subtotal;
}