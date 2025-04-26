package com.meetuptravel.backend.service.impl;

import com.meetuptravel.backend.dto.AdditionalServiceDTO;
import com.meetuptravel.backend.dto.TourDTO;
import com.meetuptravel.backend.dto.TourPricingDTO;
import com.meetuptravel.backend.dto.TourReviewDTO;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.*;
import com.meetuptravel.backend.repository.*;
import com.meetuptravel.backend.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final CategoryRepository categoryRepository;
    private final AdditionalServiceRepository additionalServiceRepository;
    private final TourPricingRepository tourPricingRepository;
    private final TourReviewRepository tourReviewRepository;

    @Override
    public Page<TourDTO> getAllTours(Pageable pageable) {
        return tourRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public TourDTO getTourById(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
        return convertToDTO(tour);
    }

    @Override
    public Page<TourDTO> getFeaturedTours(Pageable pageable) {
        return tourRepository.findByFeatured(true, pageable).map(this::convertToDTO);
    }

    @Override
    public Page<TourDTO> getToursByCategory(String categoryName, Pageable pageable) {
        return tourRepository.findByCategoryName(categoryName, pageable).map(this::convertToDTO);
    }

    @Override
    public Page<TourDTO> searchTours(String query, Pageable pageable) {
        return tourRepository.searchTours(query, pageable).map(this::convertToDTO);
    }

    @Override
    public List<TourDTO> getTopRatedTours() {
        return tourRepository.findTop5ByOrderByRatingDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TourDTO createTour(TourDTO tourDTO) {
        Tour tour = convertToEntity(tourDTO);
        Tour savedTour = tourRepository.save(tour);

        // Save pricing options if provided
        if (tourDTO.getPricingOptions() != null && !tourDTO.getPricingOptions().isEmpty()) {
            savePricingOptions(savedTour, tourDTO.getPricingOptions());
        }

        return convertToDTO(savedTour);
    }

    @Override
    @Transactional
    public TourDTO updateTour(Long id, TourDTO tourDTO) {
        Tour existingTour = tourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));

        existingTour.setTitle(tourDTO.getTitle());
        existingTour.setDescription(tourDTO.getDescription());
        existingTour.setPrice(tourDTO.getPrice());
        existingTour.setDuration(tourDTO.getDuration());
        existingTour.setImageUrl(tourDTO.getImageUrl());
        existingTour.setMinPax(tourDTO.getMinPax());
        existingTour.setMaxPax(tourDTO.getMaxPax());
        existingTour.setFeatured(tourDTO.isFeatured());

        // Update new fields
        existingTour.setScheduleDescription(tourDTO.getScheduleDescription());
        existingTour.setYoutubeUrl(tourDTO.getYoutubeUrl());

        if (tourDTO.getImages() != null) {
            existingTour.setImages(new HashSet<>(tourDTO.getImages()));
        }

        if (tourDTO.getAvailableGuides() != null) {
            existingTour.setAvailableGuides(new HashSet<>(tourDTO.getAvailableGuides()));
        }

        // Update highlights
        if (tourDTO.getHighlights() != null) {
            existingTour.setHighlights(new HashSet<>(tourDTO.getHighlights()));
        }

        // Update included services
        if (tourDTO.getIncludedServices() != null) {
            existingTour.setIncludedServices(new HashSet<>(tourDTO.getIncludedServices()));
        }

        // Update excluded services
        if (tourDTO.getExcludedServices() != null) {
            existingTour.setExcludedServices(new HashSet<>(tourDTO.getExcludedServices()));
        }

        // Update pickup points
        if (tourDTO.getPickupPoints() != null) {
            existingTour.setPickupPoints(new HashSet<>(tourDTO.getPickupPoints()));
        }

        // Update categories
        if (tourDTO.getCategories() != null) {
            Set<Category> categories = new HashSet<>();
            for (String categoryName : tourDTO.getCategories()) {
                Category category = categoryRepository.findByName(categoryName)
                        .orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(categoryName);
                            return categoryRepository.save(newCategory);
                        });
                categories.add(category);
            }
            existingTour.setCategories(categories);
        }

        // Update additional services
        if (tourDTO.getAdditionalServices() != null) {
            updateAdditionalServices(existingTour, tourDTO.getAdditionalServices());
        }

        // Update pricing options
        if (tourDTO.getPricingOptions() != null) {
            // Remove existing pricing options
            tourPricingRepository.deleteAll(existingTour.getPricingOptions());
            existingTour.getPricingOptions().clear();

            // Add new pricing options
            savePricingOptions(existingTour, tourDTO.getPricingOptions());
        }

        Tour updatedTour = tourRepository.save(existingTour);
        return convertToDTO(updatedTour);
    }

    @Override
    @Transactional
    public void deleteTour(Long id) {
        if (!tourRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tour not found with id: " + id);
        }
        tourRepository.deleteById(id);
    }

    private TourDTO convertToDTO(Tour tour) {
        TourDTO tourDTO = new TourDTO();
        tourDTO.setId(tour.getId());
        tourDTO.setTitle(tour.getTitle());
        tourDTO.setDescription(tour.getDescription());
        tourDTO.setScheduleDescription(tour.getScheduleDescription());
        tourDTO.setPrice(tour.getPrice());
        tourDTO.setDuration(tour.getDuration());
        tourDTO.setImageUrl(tour.getImageUrl());
        tourDTO.setMinPax(tour.getMinPax());
        tourDTO.setMaxPax(tour.getMaxPax());
        tourDTO.setRating(tour.getRating());
        tourDTO.setFeatured(tour.isFeatured());
        tourDTO.setImages(tour.getImages());
        tourDTO.setHighlights(tour.getHighlights());
        tourDTO.setIncludedServices(tour.getIncludedServices());
        tourDTO.setExcludedServices(tour.getExcludedServices());
        tourDTO.setPickupPoints(tour.getPickupPoints());
        tourDTO.setAvailableGuides(tour.getAvailableGuides());
        tourDTO.setYoutubeUrl(tour.getYoutubeUrl());

        // Convert categories to set of category names
        Set<String> categoryNames = tour.getCategories().stream()
                .map(Category::getName)
                .collect(Collectors.toSet());
        tourDTO.setCategories(categoryNames);

        // Convert additional services
        if (tour.getAdditionalServices() != null && !tour.getAdditionalServices().isEmpty()) {
            Set<AdditionalServiceDTO> additionalServiceDTOs = tour.getAdditionalServices().stream()
                    .map(this::convertToAdditionalServiceDTO)
                    .collect(Collectors.toSet());
            tourDTO.setAdditionalServices(additionalServiceDTOs);
        } else {
            // Initialize with empty set instead of null
            tourDTO.setAdditionalServices(new HashSet<>());
        }

        // Convert pricing options
        if (tour.getPricingOptions() != null && !tour.getPricingOptions().isEmpty()) {
            Set<TourPricingDTO> pricingDTOs = tour.getPricingOptions().stream()
                    .map(this::convertToPricingDTO)
                    .collect(Collectors.toSet());
            tourDTO.setPricingOptions(pricingDTOs);
        } else {
            // Initialize with empty set instead of null
            tourDTO.setPricingOptions(new HashSet<>());
        }

        // Convert reviews
        if (tour.getReviews() != null && !tour.getReviews().isEmpty()) {
            Set<TourReviewDTO> reviewDTOs = tour.getReviews().stream()
                    .map(this::convertToReviewDTO)
                    .collect(Collectors.toSet());
            tourDTO.setReviews(reviewDTOs);
        } else {
            // Initialize with empty set instead of null
            tourDTO.setReviews(new HashSet<>());
        }

        return tourDTO;
    }

    private Tour convertToEntity(TourDTO tourDTO) {
        Tour tour = new Tour();
        tour.setTitle(tourDTO.getTitle());
        tour.setDescription(tourDTO.getDescription());
        tour.setScheduleDescription(tourDTO.getScheduleDescription());
        tour.setPrice(tourDTO.getPrice());
        tour.setDuration(tourDTO.getDuration());
        tour.setImageUrl(tourDTO.getImageUrl());
        tour.setMinPax(tourDTO.getMinPax());
        tour.setMaxPax(tourDTO.getMaxPax());
        tour.setFeatured(tourDTO.isFeatured());
        tour.setYoutubeUrl(tourDTO.getYoutubeUrl());

        if (tourDTO.getImages() != null) {
            tour.setImages(new HashSet<>(tourDTO.getImages()));
        }

        if (tourDTO.getHighlights() != null) {
            tour.setHighlights(new HashSet<>(tourDTO.getHighlights()));
        }

        if (tourDTO.getIncludedServices() != null) {
            tour.setIncludedServices(new HashSet<>(tourDTO.getIncludedServices()));
        }

        if (tourDTO.getExcludedServices() != null) {
            tour.setExcludedServices(new HashSet<>(tourDTO.getExcludedServices()));
        }

        if (tourDTO.getPickupPoints() != null) {
            tour.setPickupPoints(new HashSet<>(tourDTO.getPickupPoints()));
        }

        if (tourDTO.getAvailableGuides() != null) {
            tour.setAvailableGuides(new HashSet<>(tourDTO.getAvailableGuides()));
        }

        // Process categories
        if (tourDTO.getCategories() != null) {
            Set<Category> categories = new HashSet<>();
            for (String categoryName : tourDTO.getCategories()) {
                Category category = categoryRepository.findByName(categoryName)
                        .orElseGet(() -> {
                            Category newCategory = new Category();
                            newCategory.setName(categoryName);
                            return categoryRepository.save(newCategory);
                        });
                categories.add(category);
            }
            tour.setCategories(categories);
        }

        // Process additional services
        if (tourDTO.getAdditionalServices() != null && !tourDTO.getAdditionalServices().isEmpty()) {
            Set<AdditionalService> services = new HashSet<>();
            for (AdditionalServiceDTO serviceDTO : tourDTO.getAdditionalServices()) {
                AdditionalService service;
                if (serviceDTO.getId() != null) {
                    service = additionalServiceRepository.findById(serviceDTO.getId())
                            .orElseGet(() -> createAdditionalService(serviceDTO));
                } else {
                    service = additionalServiceRepository.findByName(serviceDTO.getName())
                            .orElseGet(() -> createAdditionalService(serviceDTO));
                }
                services.add(service);
            }
            tour.setAdditionalServices(services);
        }

        return tour;
    }

    private void savePricingOptions(Tour tour, Set<TourPricingDTO> pricingDTOs) {
        for (TourPricingDTO pricingDTO : pricingDTOs) {
            TourPricing pricing = new TourPricing();
            pricing.setTour(tour);
            pricing.setCustomerType(pricingDTO.getCustomerType());
            pricing.setPrice(pricingDTO.getPrice());
            pricing.setIsRoundTrip(pricingDTO.getIsRoundTrip());

            TourPricing savedPricing = tourPricingRepository.save(pricing);
            tour.getPricingOptions().add(savedPricing);
        }
    }

    private void updateAdditionalServices(Tour tour, Set<AdditionalServiceDTO> serviceDTOs) {
        Set<AdditionalService> services = new HashSet<>();

        for (AdditionalServiceDTO serviceDTO : serviceDTOs) {
            AdditionalService service;
            if (serviceDTO.getId() != null) {
                service = additionalServiceRepository.findById(serviceDTO.getId())
                        .orElseGet(() -> createAdditionalService(serviceDTO));
            } else {
                service = additionalServiceRepository.findByName(serviceDTO.getName())
                        .orElseGet(() -> createAdditionalService(serviceDTO));
            }
            services.add(service);
        }

        tour.setAdditionalServices(services);
    }

    private AdditionalService createAdditionalService(AdditionalServiceDTO dto) {
        AdditionalService service = new AdditionalService();
        service.setName(dto.getName());
        service.setDescription(dto.getDescription());
        service.setPrice(dto.getPrice());
        service.setPriceUnit(dto.getPriceUnit());
        return additionalServiceRepository.save(service);
    }

    private AdditionalServiceDTO convertToAdditionalServiceDTO(AdditionalService service) {
        AdditionalServiceDTO dto = new AdditionalServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setDescription(service.getDescription());
        dto.setPrice(service.getPrice());
        dto.setPriceUnit(service.getPriceUnit());
        return dto;
    }

    private TourPricingDTO convertToPricingDTO(TourPricing pricing) {
        TourPricingDTO dto = new TourPricingDTO();
        dto.setId(pricing.getId());
        dto.setCustomerType(pricing.getCustomerType());
        dto.setPrice(pricing.getPrice());
        dto.setIsRoundTrip(pricing.getIsRoundTrip());
        return dto;
    }

    private TourReviewDTO convertToReviewDTO(TourReview review) {
        TourReviewDTO dto = new TourReviewDTO();
        dto.setId(review.getId());
        dto.setPlatform(review.getPlatform());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setReviewerName(review.getReviewerName());
        dto.setReviewDate(review.getReviewDate());
        return dto;
    }
}