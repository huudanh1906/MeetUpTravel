package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.TourDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TourService {

    Page<TourDTO> getAllTours(Pageable pageable);

    TourDTO getTourById(Long id);

    Page<TourDTO> getFeaturedTours(Pageable pageable);

    Page<TourDTO> getToursByCategory(String categoryName, Pageable pageable);

    Page<TourDTO> searchTours(String query, Pageable pageable);

    List<TourDTO> getTopRatedTours();

    TourDTO createTour(TourDTO tourDTO);

    TourDTO updateTour(Long id, TourDTO tourDTO);

    void deleteTour(Long id);
}