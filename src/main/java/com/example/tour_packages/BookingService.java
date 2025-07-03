package com.example.tour_packages;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    private final BookingRepository repository;

    public BookingService(BookingRepository repository) {
        this.repository = repository;
    }

    public Booking saveBooking(Booking booking) {
        return repository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return repository.findAll();
    }

    // ✅ Instead of deleting, mark status as "Cancelled"
    public Booking cancelBooking(Long id) {
        Optional<Booking> bookingOpt = repository.findById(id);
        if (bookingOpt.isEmpty()) return null;

        Booking booking = bookingOpt.get();
        booking.setStatus("Cancelled");
        return repository.save(booking); // Save with updated status
    }
}
