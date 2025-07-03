package com.example.tour_packages;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;



    // User registration
    public User newUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
        throw new IllegalArgumentException("Email already in use");
    }
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public boolean emailExists(String email) {
    return userRepository.existsByEmail(email);
}

    // Delete user by username
    public boolean deleteUserByUsername(String username) {
    User user = userRepository.findByUsername(username);
    if (user != null) {
        userRepository.deleteByUsername(username);
        return true;
    }
    return false;
}

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new UsernameNotFoundException(username);
        return user;
    }
}