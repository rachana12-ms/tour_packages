package com.example.tour_packages;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TourPackageService {
    private final TourPackageRepository repository;

    public TourPackage saveTourPackage(TourPackage tourPackage) {
    return repository.save(tourPackage);
    }

    public boolean deleteTourPackage(Long id) {
        if (repository.findById(id).isPresent()) {
            repository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public TourPackageService(TourPackageRepository repository) {
        this.repository = repository;
    }

    public List<TourPackage> getAllPackages() {
        return repository.findAll();
    }
    public List<TourPackage> getTourPackageById(Long id) {
    return repository.findById(id)
        .map(List::of)
        .orElse(List.of());
  }
    public List<TourPackage> getByDestination(String destination) {
        return repository.findByDestination(destination);
    }

    public List<TourPackage> filterByPriceRange(double minPrice, double maxPrice) {
    return repository.findByPriceBetween(minPrice, maxPrice);
    }

    public List<TourPackage> filterByDurationRange(int min, int max) {
    return repository.findByDurationBetween(min, max);
    }

    public List<TourPackage> searchByKeyword(String keyword) {
    return repository.findByDescriptionContainingIgnoreCaseOrDestinationContainingIgnoreCase(keyword, keyword);
    }
    
    public List<TourPackage> getByDestinationAndPrice(String destination, double price) {
        return repository.findByDestinationAndPriceLessThanEqual(destination, price);
    }
}