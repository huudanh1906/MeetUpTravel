package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Booking;
import com.meetuptravel.backend.model.BookingPricingOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingPricingOptionRepository extends JpaRepository<BookingPricingOption, Long> {
    List<BookingPricingOption> findByBooking(Booking booking);

    void deleteByBooking(Booking booking);
}