package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByTourIdAndDepartureDateAndStatus(Long tourId, LocalDate departureDate,
            Booking.BookingStatus status);

    Page<Booking> findByStatus(Booking.BookingStatus status, Pageable pageable);

    List<Booking> findByCustomerEmail(String email);

    Page<Booking> findByCustomerEmail(String email, Pageable pageable);
}