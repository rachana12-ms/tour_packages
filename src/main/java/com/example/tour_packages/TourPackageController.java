package com.example.tour_packages;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.tour_packages.GlobalExceptionHandler.ResourceNotFoundException;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/tour-packages")
public class TourPackageController {
    private final TourPackageService service;

    public TourPackageController(TourPackageService service) {
        this.service = service;
    }

    @PreAuthorize("hasAuthority('admin')")
    @PostMapping
    public TourPackage createTourPackage(@Valid @RequestBody TourPackage tourPackage) {
    return service.saveTourPackage(tourPackage);
    }

    @PreAuthorize("hasAuthority('admin')")
    @PutMapping("/{id}")
    public TourPackage updateTourPackage(@PathVariable Long id, @Valid @RequestBody TourPackage tourPackage) {
        tourPackage.setId(id);
        return service.saveTourPackage(tourPackage);
    }

    @PreAuthorize("hasAuthority('admin')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTourPackage(@PathVariable Long id) {
        boolean deleted = service.deleteTourPackage(id);
        if (deleted) {
            return ResponseEntity.ok("Tour package with ID " + id + " deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No tour package found with ID: " + id);
        }
    }

    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping
    public List<TourPackage> getAllPackages() {
        return service.getAllPackages();
    }
    
    @PreAuthorize("hasAuthority('admin')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getTourPackageById(@PathVariable Long id) {
        if (id == null || id <= 0) {
            return ResponseEntity.badRequest().body("ID must be a positive number.");
        }
        List<TourPackage> result = service.getTourPackageById(id);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No tour package found with ID: " + id);
        }
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping("/destination/{destination}")
    public ResponseEntity<?> getByDestination(@PathVariable String destination) {
        List<TourPackage> result = service.getByDestination(destination);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No tour packages found for destination: " + destination);
        }
        return ResponseEntity.ok(result);
    }

  
    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping("/filter/price")
    public List<TourPackage> filterByPriceRange(@RequestParam double minPrice, @RequestParam double maxPrice) {
        if (minPrice < 0 || maxPrice < 0) {
            throw new IllegalArgumentException("minPrice and maxPrice must be positive.");
        }
        if (minPrice > maxPrice) {
            throw new IllegalArgumentException("minPrice cannot be greater than maxPrice.");
        }
        List<TourPackage> result = service.filterByPriceRange(minPrice, maxPrice);
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("No tour packages found in the price range.");
        }
        return result;
    }

    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping("/filter/duration")
    public List<TourPackage> filterByDurationRange(@RequestParam int min, @RequestParam int max) {
        if (min < 0 || max < 0) {
            throw new IllegalArgumentException("min and max duration must be positive.");
        }
        if (min > max) {
            throw new IllegalArgumentException("min duration cannot be greater than max duration.");
        }
        List<TourPackage> result = service.filterByDurationRange(min, max);
        if (result.isEmpty()) {
            throw new ResourceNotFoundException("No tour packages found in the duration range.");
        }
        return result;
    }

    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping("/search/keyword")
    public ResponseEntity<?> searchByKeyword(@RequestParam String keyword) {
        List<TourPackage> result = service.searchByKeyword(keyword);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No tour packages found for keyword: " + keyword);
        }
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyAuthority('admin','customer')")
    @GetMapping("/filter")
    public ResponseEntity<?> getByDestinationAndPrice(
            @RequestParam String destination,
            @RequestParam double maxPrice) {
        List<TourPackage> result = service.getByDestinationAndPrice(destination, maxPrice);
        if (result.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("No tour packages found for destination " + destination + " and price <= " + maxPrice);
        }
        return ResponseEntity.ok(result);
    }

}
