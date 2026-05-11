package com.hrms.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)   // ✅ IMPORTANT
    public Map<String, String> handleException(ResourceNotFoundException ex) {

        Map<String, String> error = new HashMap<>();
        error.put("message", ex.getMessage());

        return error;
    }

    // ✅ Handle generic errors (VERY IMPORTANT)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public Map<String, String> handleGeneric(Exception ex) {

        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());

        return error;
    }
}