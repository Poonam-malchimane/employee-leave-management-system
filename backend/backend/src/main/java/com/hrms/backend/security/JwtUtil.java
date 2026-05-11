package com.hrms.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;

public class JwtUtil {

    private static final Key SECRET_KEY =
            Keys.hmacShaKeyFor("mysecretkeymysecretkeymysecretkey123".getBytes());

    public static String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
