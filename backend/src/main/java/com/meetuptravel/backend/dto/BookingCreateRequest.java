package com.meetuptravel.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreateRequest {

    @NotNull(message = "Tour ID is required")
    private Long tourId;

    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;

    private LocalDate endDate;

    @NotEmpty(message = "Customer name is required")
    private String customerName;

    @NotEmpty(message = "Customer email is required")
    @Email(message = "Email should be valid")
    private String customerEmail;

    private String pickupLocation;

    private String pickupAddress;

    private String whatsappNumber;

    private String noteForMeetup;

    private List<CreateBookingAdditionalServiceRequest> additionalServices;

    private List<CreateBookingPricingOptionRequest> pricingOptions;
}