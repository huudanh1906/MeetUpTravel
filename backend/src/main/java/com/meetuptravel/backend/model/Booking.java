package com.meetuptravel.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    // Remove user_id relationship as there's no login functionality
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "user_id", nullable = false)
    // private User user;

    // Added customer fields
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "customer_email", nullable = false)
    private String customerEmail;

    // Renamed to departure_date for clarity
    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    private LocalDate endDate;

    // Thông tin đón khách
    private String pickupLocation;

    private String pickupAddress;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private LocalDateTime bookingTime = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING;

    private String paymentId;

    private String whatsappNumber;

    @Column(columnDefinition = "TEXT")
    private String noteForMeetup;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingAdditionalService> additionalServices = new ArrayList<>();

    // Add new relationship to BookingPricingOption
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingPricingOption> pricingOptions = new ArrayList<>();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    public enum BookingStatus {
        PENDING, CONFIRMED, CANCELLED, COMPLETED
    }

    // Helper methods to manage bidirectional relationships
    public void addAdditionalService(BookingAdditionalService service) {
        additionalServices.add(service);
        service.setBooking(this);
    }

    public void removeAdditionalService(BookingAdditionalService service) {
        additionalServices.remove(service);
        service.setBooking(null);
    }

    // Add helper methods for BookingPricingOption
    public void addPricingOption(BookingPricingOption option) {
        pricingOptions.add(option);
        option.setBooking(this);
    }

    public void removePricingOption(BookingPricingOption option) {
        pricingOptions.remove(option);
        option.setBooking(null);
    }

    public void addPayment(Payment payment) {
        payments.add(payment);
        payment.setBooking(this);
    }

    public void removePayment(Payment payment) {
        payments.remove(payment);
        payment.setBooking(null);
    }
}