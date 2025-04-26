package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.BookingCreateRequest;
import com.meetuptravel.backend.dto.BookingDTO;
import com.meetuptravel.backend.model.Booking;
import com.meetuptravel.backend.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.Year;
import java.time.ZoneId;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.format.annotation.DateTimeFormat;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingCreateRequest bookingCreateRequest) {
        BookingDTO bookingDTO = bookingService.createBooking(bookingCreateRequest);
        return new ResponseEntity<>(bookingDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BookingDTO>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getAllBookings(pageable));
    }

    @GetMapping("/by-email")
    public ResponseEntity<Page<BookingDTO>> getBookingsByEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(bookingService.getBookingsByEmail(email, pageable));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long id,
            @RequestParam Booking.BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a booking by ID - Admin only operation
     * 
     * @param id Booking ID to delete
     * @return Empty response with 204 No Content status
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Confirm VietQR payment for a booking
     * 
     * @param id        The booking ID
     * @param reference Optional payment reference (e.g., bank transaction number)
     * @return Updated booking details
     */
    @PostMapping("/{id}/confirm-vietqr-payment")
    public ResponseEntity<BookingDTO> confirmVietQRPayment(
            @PathVariable Long id,
            @RequestParam(required = false) String reference) {
        BookingDTO booking = bookingService.confirmVietQRPayment(id, reference);
        return ResponseEntity.ok(booking);
    }

    /**
     * Endpoint to get yearly booking statistics with monthly breakdown
     * 
     * @param year Optional year parameter, defaults to current year if not provided
     * @return Map with yearly statistics including monthly counts and total revenue
     */
    @GetMapping("/stats/yearly")
    public ResponseEntity<Map<String, Object>> getYearlyBookingStats(
            @RequestParam(required = false) Integer year) {

        // Use current year if not specified
        int targetYear = year != null ? year : Year.now().getValue();

        // Get all bookings - using pageable with a large size to get all
        Pageable allItems = PageRequest.of(0, 1000);
        Page<BookingDTO> bookingsPage = bookingService.getAllBookings(allItems);
        List<BookingDTO> bookings = bookingsPage.getContent();

        // Initialize counts for all months
        Map<String, Integer> monthlyCounts = new LinkedHashMap<>();
        monthlyCounts.put("January", 0);
        monthlyCounts.put("February", 0);
        monthlyCounts.put("March", 0);
        monthlyCounts.put("April", 0);
        monthlyCounts.put("May", 0);
        monthlyCounts.put("June", 0);
        monthlyCounts.put("July", 0);
        monthlyCounts.put("August", 0);
        monthlyCounts.put("September", 0);
        monthlyCounts.put("October", 0);
        monthlyCounts.put("November", 0);
        monthlyCounts.put("December", 0);

        // Track total revenue from COMPLETED bookings
        BigDecimal totalRevenue = BigDecimal.ZERO;

        // Count only COMPLETED bookings by month for the specified year
        for (BookingDTO booking : bookings) {
            if (booking.getBookingTime() != null && booking.getStatus() == Booking.BookingStatus.COMPLETED) {
                LocalDateTime bookingTime = booking.getBookingTime();

                if (bookingTime.getYear() == targetYear) {
                    String monthName = bookingTime.getMonth().toString();
                    monthName = monthName.charAt(0) + monthName.substring(1).toLowerCase();
                    monthlyCounts.put(monthName, monthlyCounts.getOrDefault(monthName, 0) + 1);

                    // Add this booking's revenue to total
                    if (booking.getTotalPrice() != null) {
                        totalRevenue = totalRevenue.add(booking.getTotalPrice());
                    }
                }
            }
        }

        // Prepare response data
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("year", targetYear);
        response.put("monthlyCounts", monthlyCounts);
        response.put("labels", monthlyCounts.keySet());
        response.put("data", monthlyCounts.values());
        response.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(response);
    }
}