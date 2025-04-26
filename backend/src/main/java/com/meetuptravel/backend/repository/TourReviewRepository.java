package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.model.TourReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourReviewRepository extends JpaRepository<TourReview, Long> {
    List<TourReview> findByTour(Tour tour);

    List<TourReview> findByTourAndPlatform(Tour tour, String platform);

    long countByTour(Tour tour);
}