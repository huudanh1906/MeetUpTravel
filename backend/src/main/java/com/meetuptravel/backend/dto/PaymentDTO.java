package com.meetuptravel.backend.dto;

import com.meetuptravel.backend.model.Payment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Long bookingId;
    private String paymentMethod;
    private String transactionId;
    private BigDecimal amount;
    private String currency;
    private Payment.PaymentStatus paymentStatus;
    private LocalDateTime paymentTime;
}