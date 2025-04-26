package com.meetuptravel.backend.dto;

import com.meetuptravel.backend.model.Booking;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private Long tourId;
    private String tourTitle;
    private String tourImageUrl;
    private String customerName;
    private String customerEmail;
    private LocalDate departureDate;
    private LocalDate endDate;
    private String pickupLocation;
    private String pickupAddress;
    private BigDecimal totalPrice;
    private LocalDateTime bookingTime;
    private Booking.BookingStatus status;
    private String paymentId;
    private String whatsappNumber;
    private String noteForMeetup;
    private List<BookingAdditionalServiceDTO> additionalServices;
    private List<BookingPricingOptionDTO> pricingOptions;
    private List<PaymentDTO> payments;
}