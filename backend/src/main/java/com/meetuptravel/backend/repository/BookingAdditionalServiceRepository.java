package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Booking;
import com.meetuptravel.backend.model.BookingAdditionalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingAdditionalServiceRepository extends JpaRepository<BookingAdditionalService, Long> {
    List<BookingAdditionalService> findByBooking(Booking booking);

    List<BookingAdditionalService> findByBookingId(Long bookingId);
}