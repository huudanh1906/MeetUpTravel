package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.PaymentDTO;

public interface PaymentService {

    /**
     * Verify a payment as completed
     * 
     * @param id Payment ID to verify
     * @return The updated payment information
     */
    PaymentDTO verifyPayment(Long id);
}