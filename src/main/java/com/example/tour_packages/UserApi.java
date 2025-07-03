package com.example.tour_packages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserApi {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    

    // SignUp
    @PostMapping("/")
    public ResponseEntity<?> createNewUser(@RequestBody User user) {
    if (userService.emailExists(user.getEmail())) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use");
    }
    user.setPassword(passwordEncoder.encode(user.getPassword()));
    return ResponseEntity.ok(userService.newUser(user));
}

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
    User user = userService.findByUsername(username);
    if (user != null) {
        user.setPassword(null); // Don't expose password
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}
    
    @Transactional
    @PreAuthorize("hasAuthority('admin')")
    @DeleteMapping("/{username}")
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        boolean deleted = userService.deleteUserByUsername(username);
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("User not found: " + username);
        }
    }
}