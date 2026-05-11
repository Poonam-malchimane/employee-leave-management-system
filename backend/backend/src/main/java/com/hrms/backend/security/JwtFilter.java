package com.hrms.backend.security;

import com.hrms.backend.entity.User;
import com.hrms.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                     HttpServletResponse response,
                                     FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        System.out.println("API HIT: " + path);

        // ✅ PUBLIC APIs (VERY IMPORTANT)
        if (path.contains("/api/users/login") ||
                path.contains("/api/users/add") ||
                path.contains("/api/users/test") ||
                path.contains("/api/leaves/apply")) {

            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = authHeader.substring(7);

        String email;
        try {
            email = JwtUtil.extractEmail(token);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if( user != null) {
            System.out.println("User role: " + user.getRole());
        }

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 🔐 ROLE CHECK (ADMIN only)
        if (path.contains("/approve") || path.contains("/reject")) {
            if (!user.getRole().equals("ADMIN")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}