package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class HealthCheckController {

    private final UserRepository userRepository;

    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();

        // Check if database is connected by counting users
        try {
            long userCount = userRepository.count();
            response.put("status", "UP");
            response.put("database", "Connected");
            response.put("userCount", userCount);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("database", "Disconnected");
            response.put("error", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }
}