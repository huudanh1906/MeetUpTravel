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

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

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
        return createAuthResponse(loginRequest.getEmail(), loginRequest.getPassword(), null);
    }

    private ResponseEntity<?> createAuthResponse(String email, String password, User user) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        if (user == null) {
            user = userRepository.findByEmail(email).orElseThrow();
        }

        AuthResponse authResponse = AuthResponse.builder()
                .token(jwt)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(authResponse);
    }
}