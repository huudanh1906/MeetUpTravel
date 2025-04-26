package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.TourPricingDTO;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.model.TourPricing;
import com.meetuptravel.backend.repository.TourPricingRepository;
import com.meetuptravel.backend.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tour-pricing")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TourPricingController {

    private final TourPricingRepository tourPricingRepository;
    private final TourRepository tourRepository;

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<TourPricingDTO>> getPricingsByTourId(@PathVariable Long tourId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        List<TourPricingDTO> pricings = tourPricingRepository.findByTour(tour).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pricings);
    }

    @GetMapping("/tour/{tourId}/round-trip/{isRoundTrip}")
    public ResponseEntity<List<TourPricingDTO>> getPricingsByTourIdAndRoundTrip(
            @PathVariable Long tourId,
            @PathVariable Boolean isRoundTrip) {

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        List<TourPricingDTO> pricings = tourPricingRepository.findByTourAndIsRoundTrip(tour, isRoundTrip).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(pricings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourPricingDTO> getPricingById(@PathVariable Long id) {
        TourPricing pricing = tourPricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour pricing not found with id: " + id));

        return ResponseEntity.ok(convertToDTO(pricing));
    }

    @PostMapping("/tour/{tourId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourPricingDTO> createPricing(
            @PathVariable Long tourId,
            @RequestBody TourPricingDTO pricingDTO) {

        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Check if pricing already exists for this tour, customer type and round trip
        // option
        if (tourPricingRepository.findByTourAndCustomerTypeAndIsRoundTrip(
                tour, pricingDTO.getCustomerType(), pricingDTO.getIsRoundTrip()).isPresent()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }

        TourPricing pricing = convertToEntity(pricingDTO);
        pricing.setTour(tour);

        TourPricing savedPricing = tourPricingRepository.save(pricing);
        return new ResponseEntity<>(convertToDTO(savedPricing), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourPricingDTO> updatePricing(
            @PathVariable Long id,
            @RequestBody TourPricingDTO pricingDTO) {

        TourPricing existingPricing = tourPricingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour pricing not found with id: " + id));

        existingPricing.setCustomerType(pricingDTO.getCustomerType());
        existingPricing.setPrice(pricingDTO.getPrice());
        existingPricing.setIsRoundTrip(pricingDTO.getIsRoundTrip());

        TourPricing updatedPricing = tourPricingRepository.save(existingPricing);
        return ResponseEntity.ok(convertToDTO(updatedPricing));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePricing(@PathVariable Long id) {
        if (!tourPricingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tour pricing not found with id: " + id);
        }

        tourPricingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private TourPricingDTO convertToDTO(TourPricing pricing) {
        TourPricingDTO dto = new TourPricingDTO();
        dto.setId(pricing.getId());
        dto.setCustomerType(pricing.getCustomerType());
        dto.setPrice(pricing.getPrice());
        dto.setIsRoundTrip(pricing.getIsRoundTrip());
        return dto;
    }

    private TourPricing convertToEntity(TourPricingDTO dto) {
        TourPricing pricing = new TourPricing();
        pricing.setCustomerType(dto.getCustomerType());
        pricing.setPrice(dto.getPrice());
        pricing.setIsRoundTrip(dto.getIsRoundTrip());
        return pricing;
    }
}