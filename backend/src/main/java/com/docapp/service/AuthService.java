package com.docapp.service;

import com.docapp.dto.request.LoginRequest;
import com.docapp.dto.request.RegisterRequest;
import com.docapp.dto.response.AuthResponse;
import com.docapp.exception.ResourceNotFoundException;
import com.docapp.model.User;
import com.docapp.repository.UserRepository;
import com.docapp.security.JwtTokenProvider;
import com.docapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.PATIENT)
                .build();

        userRepository.save(user);

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        String token = tokenProvider.generateToken(auth);
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(principal.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));

        String token = tokenProvider.generateToken(auth);
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return AuthResponse.builder()
                .token(token).type("Bearer")
                .id(principal.getId()).name(user.getName())
                .email(user.getEmail()).role(user.getRole().name())
                .build();
    }
}
