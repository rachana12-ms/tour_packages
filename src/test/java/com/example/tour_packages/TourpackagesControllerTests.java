package com.example.tour_packages;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class TourpackagesControllerTests {

    @Mock
    private TourPackageService service;

    @InjectMocks
    private TourPackageController controller;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetTourPackageById_found() {
        TourPackage pkg = new TourPackage();
        pkg.setId(1L);
        when(service.getTourPackageById(1L)).thenReturn(Arrays.asList(pkg));

        ResponseEntity<?> response = controller.getTourPackageById(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        @SuppressWarnings("unchecked")
        List<TourPackage> result = (List<TourPackage>) response.getBody();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(service, times(1)).getTourPackageById(1L);
    }

    @Test
    void testGetTourPackageById_notFound() {
        when(service.getTourPackageById(2L)).thenReturn(Arrays.asList());

        ResponseEntity<?> response = controller.getTourPackageById(2L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody() instanceof String); // error message expected
        verify(service, times(1)).getTourPackageById(2L);
    }

    @Test
    void testGetAllTourPackages() {
        when(service.getAllPackages()).thenReturn(Arrays.asList(new TourPackage(), new TourPackage()));

        List<TourPackage> result = controller.getAllPackages();

        assertEquals(2, result.size());
        verify(service, times(1)).getAllPackages();
    }

    @Test
    void testSaveTourPackage() {
        TourPackage pkg = new TourPackage();
        pkg.setDestination("Paris");
        when(service.saveTourPackage(any(TourPackage.class))).thenReturn(pkg);

        TourPackage result = controller.createTourPackage(pkg);

        assertNotNull(result);
        assertEquals("Paris", result.getDestination());
        verify(service, times(1)).saveTourPackage(any(TourPackage.class));
    }

    @Test
    void testDeleteTourPackage_found() {
        when(service.deleteTourPackage(1L)).thenReturn(true);

        ResponseEntity<String> response = controller.deleteTourPackage(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Tour package with ID 1 deleted successfully.", response.getBody());
        verify(service, times(1)).deleteTourPackage(1L);
    }

    @Test
    void testDeleteTourPackage_notFound() {
        when(service.deleteTourPackage(2L)).thenReturn(false);

        ResponseEntity<String> response = controller.deleteTourPackage(2L);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("No tour package found with ID: 2", response.getBody());
        verify(service, times(1)).deleteTourPackage(2L);
    }
}