package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.TourReviewDTO;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.model.TourReview;
import com.meetuptravel.backend.repository.TourRepository;
import com.meetuptravel.backend.repository.TourReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tour-reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TourReviewController {

    private final TourReviewRepository tourReviewRepository;
    private final TourRepository tourRepository;

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourReviewDTO>> getReviewsByTourId(@PathVariable Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        List<TourReviewDTO> reviews = tourReviewRepository.findByTour(tour).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/tour/{tourId}/platform/{platform}")
    public ResponseEntity<List<TourReviewDTO>> getReviewsByTourIdAndPlatform(
            @PathVariable Long tourId,
            @PathVariable String platform) {

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        List<TourReviewDTO> reviews = tourReviewRepository.findByTourAndPlatform(tour, platform).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourReviewDTO> getReviewById(@PathVariable Long id) {
        TourReview review = tourReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour review not found with id: " + id));

        return ResponseEntity.ok(convertToDTO(review));
    }

    @PostMapping("/tour/{tourId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourReviewDTO> createReview(
            @PathVariable Long tourId,
            @RequestBody TourReviewDTO reviewDTO) {

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        TourReview review = convertToEntity(reviewDTO);
        review.setTour(tour);

        // Set review date if not provided
        if (review.getReviewDate() == null) {
            review.setReviewDate(LocalDate.now());
        }

        TourReview savedReview = tourReviewRepository.save(review);
        return new ResponseEntity<>(convertToDTO(savedReview), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourReviewDTO> updateReview(
            @PathVariable Long id,
            @RequestBody TourReviewDTO reviewDTO) {

        TourReview existingReview = tourReviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour review not found with id: " + id));

        existingReview.setPlatform(reviewDTO.getPlatform());
        existingReview.setRating(reviewDTO.getRating());
        existingReview.setComment(reviewDTO.getComment());
        existingReview.setReviewerName(reviewDTO.getReviewerName());

        if (reviewDTO.getReviewDate() != null) {
            existingReview.setReviewDate(reviewDTO.getReviewDate());
        }

        TourReview updatedReview = tourReviewRepository.save(existingReview);
        return ResponseEntity.ok(convertToDTO(updatedReview));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (!tourReviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tour review not found with id: " + id);
        }

        tourReviewRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count/tour/{tourId}")
    public ResponseEntity<Long> countReviewsByTourId(@PathVariable Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        long count = tourReviewRepository.countByTour(tour);
        return ResponseEntity.ok(count);
    }

    private TourReviewDTO convertToDTO(TourReview review) {
        TourReviewDTO dto = new TourReviewDTO();
        dto.setId(review.getId());
        dto.setPlatform(review.getPlatform());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewerName(review.getReviewerName());
        dto.setReviewDate(review.getReviewDate());
        return dto;
    }

    private TourReview convertToEntity(TourReviewDTO dto) {
        TourReview review = new TourReview();
        review.setPlatform(dto.getPlatform());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setReviewerName(dto.getReviewerName());
        review.setReviewDate(dto.getReviewDate());
        return review;
    }
}