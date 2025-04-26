package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.PaymentDTO;
import com.meetuptravel.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Verify a payment as completed
     * 
     * @param id Payment ID to verify
     * @return The updated payment information
     */
    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentDTO> verifyPayment(@PathVariable Long id) {
        PaymentDTO payment = paymentService.verifyPayment(id);
        return ResponseEntity.ok(payment);
    }
}