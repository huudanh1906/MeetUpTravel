package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.model.TourPricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourPricingRepository extends JpaRepository<TourPricing, Long> {
    List<TourPricing> findByTour(Tour tour);

    List<TourPricing> findByTourAndIsRoundTrip(Tour tour, Boolean isRoundTrip);

    Optional<TourPricing> findByTourAndCustomerTypeAndIsRoundTrip(Tour tour, String customerType, Boolean isRoundTrip);
}