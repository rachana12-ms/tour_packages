package com.example.tour_packages;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @Email
    private String email;

    @Positive
    private int travelers;

    @NotBlank
    private String phoneNumber;

    @NotNull
    private LocalDate bookingDate;

    @NotBlank
    private String selectedPackage;
    
    @Column
    private String status = "Active";



    private Long packageId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getSelectedPackage() { return selectedPackage; }
    public void setSelectedPackage(String selectedPackage) { this.selectedPackage = selectedPackage; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public String getStatus() {
    return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}