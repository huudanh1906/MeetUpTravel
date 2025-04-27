package com.meetuptravel.backend.controller;

import com.meetuptravel.backend.dto.auth.AuthRequest;
import com.meetuptravel.backend.dto.auth.AuthResponse;
import com.meetuptravel.backend.dto.auth.RegisterRequest;
import com.meetuptravel.backend.model.User;
import com.meetuptravel.backend.repository.UserRepository;
import com.meetuptravel.backend.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);

        return createAuthResponse(registerRequest.getEmail(), registerRequest.getPassword(), savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        logger.info("Login attempt for email: {}", loginRequest.getEmail());
        try {
            return createAuthResponse(loginRequest.getEmail(), loginRequest.getPassword(), null);
        } catch (Exception e) {
            logger.error("Login failed for email: {}, error: {}", loginRequest.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication failed: " + e.getMessage());
        }
    }

    private ResponseEntity<?> createAuthResponse(String email, String password, User user) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            if (user == null) {
                user = userRepository.findByEmail(email).orElseThrow();
            }

            logger.info("User authenticated successfully: {}, role: {}", email, user.getRole());

            AuthResponse authResponse = AuthResponse.builder()
                    .token(jwt)
                    .userId(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .build();

            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            logger.error("Authentication error for {}: {}", email, e.getMessage(), e);
            throw e;
        }
    }
}