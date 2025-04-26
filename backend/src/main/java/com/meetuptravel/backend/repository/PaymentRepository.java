package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Booking;
import com.meetuptravel.backend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);

    List<Payment> findByBookingId(Long bookingId);

    Payment findByTransactionId(String transactionId);
}