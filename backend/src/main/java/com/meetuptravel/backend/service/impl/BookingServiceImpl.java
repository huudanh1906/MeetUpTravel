package com.meetuptravel.backend.service.impl;

import com.meetuptravel.backend.dto.*;
import com.meetuptravel.backend.exception.ResourceNotFoundException;
import com.meetuptravel.backend.model.*;
import com.meetuptravel.backend.repository.*;
import com.meetuptravel.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

        private final BookingRepository bookingRepository;
        private final TourRepository tourRepository;
        private final BookingAdditionalServiceRepository bookingAdditionalServiceRepository;
        private final BookingPricingOptionRepository bookingPricingOptionRepository;
        private final TourPricingRepository tourPricingRepository;
        private final AdditionalServiceRepository additionalServiceRepository;
        private final PaymentRepository paymentRepository;

        @Override
        @Transactional
        public BookingDTO createBooking(BookingCreateRequest request) {
                Tour tour = tourRepository.findById(request.getTourId())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "Tour not found with id: " + request.getTourId()));

                // Calculate total price based on pricing options
                BigDecimal totalPrice = calculateTotalPrice(tour, request);

                Booking booking = new Booking();
                booking.setTour(tour);
                booking.setCustomerName(request.getCustomerName());
                booking.setCustomerEmail(request.getCustomerEmail());
                booking.setDepartureDate(request.getDepartureDate());
                booking.setEndDate(request.getEndDate());
                booking.setPickupLocation(request.getPickupLocation());
                booking.setPickupAddress(request.getPickupAddress());
                booking.setTotalPrice(totalPrice);
                booking.setBookingTime(LocalDateTime.now());
                booking.setStatus(Booking.BookingStatus.PENDING);
                booking.setWhatsappNumber(request.getWhatsappNumber());
                booking.setNoteForMeetup(request.getNoteForMeetup());

                Booking savedBooking = bookingRepository.save(booking);

                // Process pricing options
                if (request.getPricingOptions() != null && !request.getPricingOptions().isEmpty()) {
                        for (CreateBookingPricingOptionRequest pricingOptionRequest : request.getPricingOptions()) {
                                TourPricing tourPricing = tourPricingRepository
                                                .findById(pricingOptionRequest.getPricingOptionId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tour pricing not found with id: "
                                                                                + pricingOptionRequest
                                                                                                .getPricingOptionId()));

                                BookingPricingOption pricingOption = new BookingPricingOption();
                                pricingOption.setBooking(savedBooking);
                                pricingOption.setPricingOption(tourPricing);
                                pricingOption.setQuantity(pricingOptionRequest.getQuantity());
                                pricingOption.setPrice(tourPricing.getPrice());
                                pricingOption.setSubtotal(tourPricing.getPrice()
                                                .multiply(BigDecimal.valueOf(pricingOptionRequest.getQuantity())));
                                bookingPricingOptionRepository.save(pricingOption);
                        }
                }

                // Process additional services
                if (request.getAdditionalServices() != null && !request.getAdditionalServices().isEmpty()) {
                        for (CreateBookingAdditionalServiceRequest serviceRequest : request.getAdditionalServices()) {
                                BookingAdditionalService service = new BookingAdditionalService();
                                service.setBooking(savedBooking);
                                service.setServiceName(serviceRequest.getServiceName());
                                service.setServiceType(serviceRequest.getServiceType());
                                service.setPrice(serviceRequest.getPrice());
                                service.setQuantity(serviceRequest.getQuantity());
                                service.setSubtotal(serviceRequest.getPrice()
                                                .multiply(BigDecimal.valueOf(serviceRequest.getQuantity())));

                                // Set the reference to the AdditionalService entity if available
                                if (serviceRequest.getAdditionalServiceId() != null) {
                                        AdditionalService additionalService = additionalServiceRepository
                                                        .findById(serviceRequest.getAdditionalServiceId())
                                                        .orElse(null);

                                        if (additionalService != null) {
                                                service.setAdditionalService(additionalService);
                                        }
                                }

                                bookingAdditionalServiceRepository.save(service);
                        }
                }

                // Refresh booking to get the updated related entities
                savedBooking = bookingRepository.findById(savedBooking.getId()).orElse(savedBooking);

                return convertToDTO(savedBooking);
        }

        private BigDecimal calculateTotalPrice(Tour tour, BookingCreateRequest request) {
                BigDecimal totalPrice = BigDecimal.ZERO;

                // Calculate price based on pricing options
                if (request.getPricingOptions() != null) {
                        for (CreateBookingPricingOptionRequest option : request.getPricingOptions()) {
                                TourPricing pricing = tourPricingRepository.findById(option.getPricingOptionId())
                                                .orElseThrow(() -> new ResourceNotFoundException(
                                                                "Tour pricing not found with id: "
                                                                                + option.getPricingOptionId()));

                                BigDecimal optionTotal = pricing.getPrice()
                                                .multiply(BigDecimal.valueOf(option.getQuantity()));
                                totalPrice = totalPrice.add(optionTotal);
                        }
                }

                // Add price for additional services if any
                if (request.getAdditionalServices() != null) {
                        for (CreateBookingAdditionalServiceRequest service : request.getAdditionalServices()) {
                                BigDecimal serviceTotal = service.getPrice()
                                                .multiply(BigDecimal.valueOf(service.getQuantity()));
                                totalPrice = totalPrice.add(serviceTotal);
                        }
                }

                return totalPrice;
        }

        @Override
        public BookingDTO getBookingById(Long id) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
                return convertToDTO(booking);
        }

        @Override
        public List<BookingDTO> getBookingsByEmail(String email) {
                List<Booking> bookings = bookingRepository.findByCustomerEmail(email);
                return bookings.stream()
                                .map(this::convertToDTO)
                                .collect(Collectors.toList());
        }

        @Override
        public Page<BookingDTO> getBookingsByEmail(String email, Pageable pageable) {
                // This method needs to be implemented in the BookingRepository
                Page<Booking> bookings = bookingRepository.findByCustomerEmail(email, pageable);
                return bookings.map(this::convertToDTO);
        }

        @Override
        public Page<BookingDTO> getAllBookings(Pageable pageable) {
                Page<Booking> bookings = bookingRepository.findAll(pageable);
                return bookings.map(this::convertToDTO);
        }

        @Override
        @Transactional
        public BookingDTO updateBookingStatus(Long id, Booking.BookingStatus status) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

                booking.setStatus(status);
                Booking updatedBooking = bookingRepository.save(booking);

                return convertToDTO(updatedBooking);
        }

        @Override
        @Transactional
        public void cancelBooking(Long id) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

                booking.setStatus(Booking.BookingStatus.CANCELLED);
                bookingRepository.save(booking);
        }

        @Override
        @Transactional
        public void deleteBooking(Long id) {
                if (!bookingRepository.existsById(id)) {
                        throw new ResourceNotFoundException("Booking not found with id: " + id);
                }
                bookingRepository.deleteById(id);
        }

        @Override
        @Transactional
        public BookingDTO confirmVietQRPayment(Long id, String reference) {
                Booking booking = bookingRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

                // Update booking status to CONFIRMED
                booking.setStatus(Booking.BookingStatus.CONFIRMED);

                // Create payment record - Change status to PENDING_VERIFICATION
                Payment payment = new Payment();
                payment.setBooking(booking);
                payment.setPaymentMethod("VietQR");
                payment.setTransactionId(reference != null ? reference : "VietQR-" + System.currentTimeMillis());
                payment.setAmount(booking.getTotalPrice());
                payment.setCurrency("VND"); // Vietnamese Dong for VietQR

                // Set payment status to PENDING until manual verification
                payment.setPaymentStatus(Payment.PaymentStatus.PENDING);
                payment.setPaymentTime(LocalDateTime.now());

                // Add a note about pending verification
                // Note: Add this field to Payment.java if it doesn't exist

                // Add payment to booking
                booking.addPayment(payment);

                // Save payment and updated booking
                paymentRepository.save(payment);
                Booking updatedBooking = bookingRepository.save(booking);

                return convertToDTO(updatedBooking);
        }

        private BookingDTO convertToDTO(Booking booking) {
                BookingDTO dto = new BookingDTO();
                dto.setId(booking.getId());
                dto.setTourId(booking.getTour().getId());
                dto.setTourTitle(booking.getTour().getTitle());
                dto.setTourImageUrl(booking.getTour().getImageUrl());
                dto.setCustomerName(booking.getCustomerName());
                dto.setCustomerEmail(booking.getCustomerEmail());
                dto.setDepartureDate(booking.getDepartureDate());
                dto.setEndDate(booking.getEndDate());
                dto.setPickupLocation(booking.getPickupLocation());
                dto.setPickupAddress(booking.getPickupAddress());
                dto.setTotalPrice(booking.getTotalPrice());
                dto.setBookingTime(booking.getBookingTime());
                dto.setStatus(booking.getStatus());
                dto.setPaymentId(booking.getPaymentId());
                dto.setWhatsappNumber(booking.getWhatsappNumber());
                dto.setNoteForMeetup(booking.getNoteForMeetup());

                // Map additional services
                if (booking.getAdditionalServices() != null) {
                        dto.setAdditionalServices(booking.getAdditionalServices().stream()
                                        .map(this::convertToAdditionalServiceDTO)
                                        .collect(Collectors.toList()));
                } else {
                        dto.setAdditionalServices(new ArrayList<>());
                }

                // Map pricing options
                if (booking.getPricingOptions() != null) {
                        dto.setPricingOptions(booking.getPricingOptions().stream()
                                        .map(this::convertToPricingOptionDTO)
                                        .collect(Collectors.toList()));
                } else {
                        dto.setPricingOptions(new ArrayList<>());
                }

                // Map payments
                if (booking.getPayments() != null) {
                        dto.setPayments(booking.getPayments().stream()
                                        .map(this::convertToPaymentDTO)
                                        .collect(Collectors.toList()));
                } else {
                        dto.setPayments(new ArrayList<>());
                }

                return dto;
        }

        private BookingAdditionalServiceDTO convertToAdditionalServiceDTO(BookingAdditionalService service) {
                BookingAdditionalServiceDTO dto = new BookingAdditionalServiceDTO();
                dto.setId(service.getId());
                dto.setServiceName(service.getServiceName());
                dto.setServiceType(service.getServiceType());
                dto.setPrice(service.getPrice());
                dto.setQuantity(service.getQuantity());
                dto.setSubtotal(service.getSubtotal());
                return dto;
        }

        private BookingPricingOptionDTO convertToPricingOptionDTO(BookingPricingOption option) {
                BookingPricingOptionDTO dto = new BookingPricingOptionDTO();
                dto.setId(option.getId());
                dto.setPricingOptionId(option.getPricingOption().getId());
                dto.setCustomerType(option.getPricingOption().getCustomerType());
                dto.setRoundTrip(option.getPricingOption().getIsRoundTrip());
                dto.setQuantity(option.getQuantity());
                dto.setPrice(option.getPrice());
                dto.setSubtotal(option.getSubtotal());
                return dto;
        }

        private PaymentDTO convertToPaymentDTO(Payment payment) {
                PaymentDTO dto = new PaymentDTO();
                dto.setId(payment.getId());
                dto.setAmount(payment.getAmount());
                dto.setCurrency(payment.getCurrency());
                dto.setPaymentMethod(payment.getPaymentMethod());
                dto.setPaymentTime(payment.getPaymentTime());
                dto.setTransactionId(payment.getTransactionId());
                dto.setPaymentStatus(payment.getPaymentStatus());
                return dto;
        }
}