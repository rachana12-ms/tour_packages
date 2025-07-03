package com.example.tour_packages;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin','customer')")
    public Booking createBooking(@Valid @RequestBody Booking booking) {
        return service.saveBooking(booking);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('admin','customer')")
    public List<Booking> getAllBookings() {
        return service.getAllBookings();
    }

    @PutMapping("/cancel/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking cancelled = service.cancelBooking(id);
        if (cancelled == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cancelled); // Send cancelled booking to frontend
    }

}
