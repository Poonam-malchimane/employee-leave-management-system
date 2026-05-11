package com.hrms.backend.controller;

import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.dto.LoginResponse;
import com.hrms.backend.dto.UserDTO;
import com.hrms.backend.entity.Leave;
import com.hrms.backend.entity.User;   // ✅ correct
import com.hrms.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public String test() {
        return "Backend is working!";
    }

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @GetMapping("/all")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }

    @PutMapping("/update/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userService.updateUser(id, userDetails);
    }
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        System.out.println("LOGIN API HIT");
        return userService.login(request);
    }
    @GetMapping("/approve")
    public String approve() {
        return "Approved by ADMIN";
    }

    @GetMapping("/reject")
    public String reject() {
        return "Rejected by ADMIN";
    }

}
