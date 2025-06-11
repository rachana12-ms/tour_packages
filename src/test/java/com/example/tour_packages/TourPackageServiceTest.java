package com.example.tour_packages;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class TourPackageServiceTest {

    @Mock
    private TourPackageRepository repository;

    @InjectMocks
    private TourPackageService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTourPackageById_found() {
        TourPackage pkg = new TourPackage();
        pkg.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(pkg));

        List<TourPackage> result = service.getTourPackageById(1L);
        assertFalse(result.isEmpty());
        assertEquals(1L, result.get(0).getId());
    }

    @Test
    void testGetTourPackageById_notFound() {
        when(repository.findById(2L)).thenReturn(Optional.empty());

        List<TourPackage> result = service.getTourPackageById(2L);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetAllTourPackages() {
        TourPackage pkg1 = new TourPackage();
        TourPackage pkg2 = new TourPackage();
        when(repository.findAll()).thenReturn(Arrays.asList(pkg1, pkg2));

        List<TourPackage> result = service.getAllPackages();
        assertEquals(2, result.size());
        verify(repository).findAll();
    }

    @Test
    void testSaveTourPackage() {
        TourPackage pkg = new TourPackage();
        pkg.setDestination("Paris");
        when(repository.save(pkg)).thenReturn(pkg);

        TourPackage result = service.saveTourPackage(pkg);
        assertNotNull(result);
        assertEquals("Paris", result.getDestination());
        verify(repository).save(pkg);
    }

    @Test
    void testDeleteTourPackage_found() {
        TourPackage pkg = new TourPackage();
        pkg.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(pkg));
        doNothing().when(repository).deleteById(1L);

        boolean deleted = service.deleteTourPackage(1L);
        assertTrue(deleted);
        verify(repository).deleteById(1L);
    }

    @Test
    void testDeleteTourPackage_notFound() {
        when(repository.findById(2L)).thenReturn(Optional.empty());

        boolean deleted = service.deleteTourPackage(2L);
        assertFalse(deleted);
        verify(repository, never()).deleteById(anyLong());
    }
}