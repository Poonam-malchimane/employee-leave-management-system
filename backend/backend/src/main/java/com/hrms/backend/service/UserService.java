package com.hrms.backend.service;

import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.dto.LoginResponse;
import com.hrms.backend.dto.UserDTO;
import com.hrms.backend.entity.Leave;
import com.hrms.backend.entity.User;
import com.hrms.backend.exception.ResourceNotFoundException;
import com.hrms.backend.repository.UserRepository;
import com.hrms.backend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ CREATE (with encryption)
    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // ✅ READ ALL
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    // ✅ LOGIN
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // ✅ UPDATED PASSWORD CHECK
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResourceNotFoundException("Invalid credentials");
        }

        String token = JwtUtil.generateToken(user.getEmail());

        return new LoginResponse(token, user.getEmail());
    }
    // ✅ GET BY ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    // ✅ UPDATE
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPassword(userDetails.getPassword());
        user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }

    // ✅ DELETE
    public String deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return "User not found";
        }
        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}
