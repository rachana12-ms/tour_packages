package com.example.tour_packages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByEmail(String email);
    void deleteByUsername(String username); // <-- added for delete operation
}