package com.hrms.backend.controller;

import org.springframework.web.bind.annotation.*;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        return "Backend is working!";
    }
}