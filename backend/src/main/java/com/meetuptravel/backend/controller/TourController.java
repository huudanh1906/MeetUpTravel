package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.AdditionalServiceDTO;
import com.meetuptravel.backend.dto.TourDTO;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.AdditionalService;
import com.meetuptravel.backend.model.Category;
import com.meetuptravel.backend.model.Tour;
import com.meetuptravel.backend.repository.AdditionalServiceRepository;
import com.meetuptravel.backend.repository.CategoryRepository;
import com.meetuptravel.backend.repository.TourRepository;
import com.meetuptravel.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TourController {

    private final TourService tourService;
    private final TourRepository tourRepository;
    private final AdditionalServiceRepository additionalServiceRepository;
    private final CategoryRepository categoryRepository;

    // Public access endpoints - Accessible to all users

    @GetMapping
    public ResponseEntity<Page<TourDTO>> getAllTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return ResponseEntity.ok(tourService.getAllTours(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourDTO> getTourById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.getTourById(id));
    }

    @GetMapping("/featured")
    public ResponseEntity<Page<TourDTO>> getFeaturedTours(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(tourService.getFeaturedTours(pageable));
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<Page<TourDTO>> getToursByCategory(
            @PathVariable String categoryName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(tourService.getToursByCategory(categoryName, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<TourDTO>> searchTours(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(tourService.searchTours(query, pageable));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<TourDTO>> getTopRatedTours() {
        return ResponseEntity.ok(tourService.getTopRatedTours());
    }

    @GetMapping("/{id}/highlights")
    public ResponseEntity<Set<String>> getTourHighlights(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour.getHighlights());
    }

    @GetMapping("/{id}/included-services")
    public ResponseEntity<Set<String>> getTourIncludedServices(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour.getIncludedServices());
    }

    @GetMapping("/{id}/excluded-services")
    public ResponseEntity<Set<String>> getTourExcludedServices(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour.getExcludedServices());
    }

    @GetMapping("/{id}/pickup-points")
    public ResponseEntity<Set<String>> getTourPickupPoints(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour.getPickupPoints());
    }

    @GetMapping("/{id}/additional-services")
    public ResponseEntity<Set<AdditionalServiceDTO>> getAdditionalServices(@PathVariable Long id) {
        TourDTO tour = tourService.getTourById(id);
        return ResponseEntity.ok(tour.getAdditionalServices() != null ? tour.getAdditionalServices() : new HashSet<>());
    }

    // Admin only endpoints - Require ADMIN role

    @PostMapping("/{tourId}/additional-services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdditionalServiceDTO> createAndAddAdditionalService(
            @PathVariable Long tourId,
            @RequestBody AdditionalServiceDTO serviceDTO) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Create new additional service
        AdditionalService service = new AdditionalService();
        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setPrice(serviceDTO.getPrice());
        service.setPriceUnit(serviceDTO.getPriceUnit());

        // Save the service
        AdditionalService savedService = additionalServiceRepository.save(service);

        // Add service to tour
        tour.getAdditionalServices().add(savedService);
        tourRepository.save(tour);

        // Convert to DTO and return
        AdditionalServiceDTO savedDTO = new AdditionalServiceDTO();
        savedDTO.setId(savedService.getId());
        savedDTO.setName(savedService.getName());
        savedDTO.setDescription(savedService.getDescription());
        savedDTO.setPrice(savedService.getPrice());
        savedDTO.setPriceUnit(savedService.getPriceUnit());

        return new ResponseEntity<>(savedDTO, HttpStatus.CREATED);
    }

    @PostMapping("/{tourId}/additional-services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourDTO> addAdditionalService(
            @PathVariable Long tourId,
            @PathVariable Long serviceId) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        AdditionalService service = additionalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Additional service not found with id: " + serviceId));

        tour.getAdditionalServices().add(service);
        tourRepository.save(tour);

        return ResponseEntity.ok(tourService.getTourById(tourId));
    }

    @PutMapping("/{tourId}/additional-services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdditionalServiceDTO> updateAdditionalService(
            @PathVariable Long tourId,
            @PathVariable Long serviceId,
            @RequestBody AdditionalServiceDTO serviceDTO) {

        // Verify tour exists
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        // Verify service exists
        AdditionalService service = additionalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Additional service not found with id: " + serviceId));

        // Verify service is associated with this tour
        if (!tour.getAdditionalServices().contains(service)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Update service details
        service.setName(serviceDTO.getName());
        service.setDescription(serviceDTO.getDescription());
        service.setPrice(serviceDTO.getPrice());
        service.setPriceUnit(serviceDTO.getPriceUnit());

        // Save updated service
        AdditionalService updatedService = additionalServiceRepository.save(service);

        // Convert to DTO and return
        AdditionalServiceDTO updatedDTO = new AdditionalServiceDTO();
        updatedDTO.setId(updatedService.getId());
        updatedDTO.setName(updatedService.getName());
        updatedDTO.setDescription(updatedService.getDescription());
        updatedDTO.setPrice(updatedService.getPrice());
        updatedDTO.setPriceUnit(updatedService.getPriceUnit());

        return ResponseEntity.ok(updatedDTO);
    }

    @DeleteMapping("/{tourId}/additional-services/{serviceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> removeAdditionalService(
            @PathVariable Long tourId,
            @PathVariable Long serviceId,
            @RequestParam(required = false, defaultValue = "false") boolean deleteService) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        AdditionalService service = additionalServiceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Additional service not found with id: " + serviceId));

        // Remove association between tour and service
        tour.getAdditionalServices().remove(service);
        tourRepository.save(tour);

        // If deleteService is true, also delete the service itself
        if (deleteService) {
            // Only delete if it's not associated with any other tours
            if (service.getTours().size() <= 1) { // 1 because the current tour is still in the set
                additionalServiceRepository.delete(service);
            }
        }

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourDTO> createTour(@RequestBody TourDTO tourDTO) {
        return new ResponseEntity<>(tourService.createTour(tourDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourDTO> updateTour(@PathVariable Long id, @RequestBody TourDTO tourDTO) {
        return ResponseEntity.ok(tourService.updateTour(id, tourDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTour(@PathVariable Long id) {
        tourService.deleteTour(id);
        return ResponseEntity.noContent().build();
    }

    // Debug endpoint - Admin only
    @GetMapping("/debug/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> debugTourServices(@PathVariable Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found"));

        Map<String, Object> debug = new HashMap<>();
        debug.put("tour", tour);
        debug.put("tourCategories", tour.getCategories());
        debug.put("tourAdditionalServices", tour.getAdditionalServices());
        debug.put("tourPricingOptions", tour.getPricingOptions());

        return ResponseEntity.ok(debug);
    }

    // Add a new debug endpoint to check the database state
    @GetMapping("/debug/db-status")
    public ResponseEntity<Map<String, Object>> getDatabaseStatus() {
        Map<String, Object> status = new HashMap<>();

        // Get counts from repositories
        long tourCount = tourRepository.count();
        long categoryCount = categoryRepository.count();

        status.put("tourCount", tourCount);
        status.put("categoryCount", categoryCount);
        status.put("databaseType", "PostgreSQL");
        status.put("timestamp", new java.util.Date().toString());

        // Get a sample of tours (first 3)
        List<Tour> sampleTours = tourRepository.findAll(PageRequest.of(0, 3)).getContent();
        status.put("sampleTours", sampleTours.stream()
                .map(tour -> {
                    Map<String, Object> tourMap = new HashMap<>();
                    tourMap.put("id", tour.getId());
                    tourMap.put("title", tour.getTitle());
                    tourMap.put("imageUrl", tour.getImageUrl());
                    tourMap.put("price", tour.getPrice());
                    tourMap.put("categories",
                            tour.getCategories().stream().map(Category::getName).collect(Collectors.toList()));
                    return tourMap;
                })
                .collect(Collectors.toList()));

        return ResponseEntity.ok(status);
    }
}