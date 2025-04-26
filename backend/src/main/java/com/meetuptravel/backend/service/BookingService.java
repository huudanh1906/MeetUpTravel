package com.meetuptravel.backend.service;

import com.meetuptravel.backend.dto.BookingCreateRequest;
import com.meetuptravel.backend.dto.BookingDTO;
import com.meetuptravel.backend.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {

    BookingDTO createBooking(BookingCreateRequest bookingCreateRequest);

    BookingDTO getBookingById(Long id);

    List<BookingDTO> getBookingsByEmail(String email);

    Page<BookingDTO> getBookingsByEmail(String email, Pageable pageable);

    Page<BookingDTO> getAllBookings(Pageable pageable);

    BookingDTO updateBookingStatus(Long id, Booking.BookingStatus status);

    void cancelBooking(Long id);

    /**
     * Delete a booking by its ID
     * 
     * @param id the ID of the booking to delete
     */
    void deleteBooking(Long id);

    /**
     * Confirm VietQR payment for a booking and update status to CONFIRMED
     * 
     * @param id        the ID of the booking
     * @param reference optional payment reference (e.g., bank transaction number)
     * @return the updated booking DTO
     */
    BookingDTO confirmVietQRPayment(Long id, String reference);
}