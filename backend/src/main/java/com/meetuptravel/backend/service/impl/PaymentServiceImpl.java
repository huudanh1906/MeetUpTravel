package com.meetuptravel.backend.service.impl;

import com.meetuptravel.backend.dto.PaymentDTO;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.Payment;
import com.meetuptravel.backend.repository.PaymentRepository;
import com.meetuptravel.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    @Transactional
    public PaymentDTO verifyPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));

        // Update payment status to COMPLETED
        payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaymentTime(LocalDateTime.now()); // Update timestamp

        Payment updatedPayment = paymentRepository.save(payment);

        return convertToDTO(updatedPayment);
    }

    private PaymentDTO convertToDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setBookingId(payment.getBooking().getId());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setPaymentStatus(payment.getPaymentStatus());
        dto.setPaymentTime(payment.getPaymentTime());
        dto.setTransactionId(payment.getTransactionId());
        return dto;
    }
}