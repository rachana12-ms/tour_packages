package com.example.tour_packages;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, Long>, JpaSpecificationExecutor<TourPackage> {
    List<TourPackage> findByDestination(String destination);
    List<TourPackage> findByPriceBetween(double minPrice, double maxPrice);
    List<TourPackage> findByDurationBetween(int min, int max);
    List<TourPackage> findByDescriptionContainingIgnoreCaseOrDestinationContainingIgnoreCase(String descKeyword, String destKeyword);
    List<TourPackage> findByDestinationAndPriceLessThanEqual(String destination, double price);  
}