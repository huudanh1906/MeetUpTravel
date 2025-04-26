package com.meetuptravel.backend.repository;

import com.meetuptravel.backend.model.Tour;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {

    Page<Tour> findByFeatured(boolean featured, Pageable pageable);

    @Query("SELECT t FROM Tour t JOIN t.categories c WHERE c.name = :categoryName")
    Page<Tour> findByCategoryName(@Param("categoryName") String categoryName, Pageable pageable);

    @Query("SELECT t FROM Tour t WHERE " +
            "LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Tour> searchTours(@Param("query") String query, Pageable pageable);

    List<Tour> findTop5ByOrderByRatingDesc();
}