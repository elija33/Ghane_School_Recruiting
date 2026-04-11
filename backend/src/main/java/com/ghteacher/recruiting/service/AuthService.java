package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.config.RateLimitConfig;
import com.ghteacher.recruiting.dto.request.LoginRequest;
import com.ghteacher.recruiting.dto.request.RefreshTokenRequest;
import com.ghteacher.recruiting.dto.request.RegisterRequest;
import com.ghteacher.recruiting.dto.response.AuthResponse;
import com.ghteacher.recruiting.entity.User;
import com.ghteacher.recruiting.enums.UserRole;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.repository.SchoolRepository;
import com.ghteacher.recruiting.repository.TeacherProfileRepository;
import com.ghteacher.recruiting.repository.UserRepository;
import com.ghteacher.recruiting.security.JwtService;
import io.github.bucket4j.Bucket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final SchoolRepository schoolRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RateLimitConfig rateLimitConfig;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already registered: " + request.getEmail());
        }

        if (request.getRole() == UserRole.ADMIN) {
            throw new BusinessException("Cannot self-register as ADMIN");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        user = userRepository.save(user);
        log.info("New {} registered: {}", request.getRole(), user.getEmail());

        String accessToken  = jwtService.generateAccessToken(
                user.getEmail(), Map.of("role", user.getRole().name()));
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .role(user.getRole())
                .profileComplete(false)
                .userId(user.getId().toString())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String clientIp) {
        Bucket bucket = rateLimitConfig.resolveBucket(clientIp);
        if (!bucket.tryConsume(1)) {
            throw new BusinessException("Too many login attempts. Please try again in 1 minute.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BusinessException("Invalid credentials"));

        boolean profileComplete = isProfileComplete(user);

        String accessToken  = jwtService.generateAccessToken(
                user.getEmail(), Map.of("role", user.getRole().name()));
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .role(user.getRole())
                .profileComplete(profileComplete)
                .userId(user.getId().toString())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String email = jwtService.extractUsername(request.getRefreshToken());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException("User not found"));

        if (!jwtService.isTokenValid(request.getRefreshToken(), email)) {
            throw new BusinessException("Refresh token is invalid or expired");
        }

        String accessToken = jwtService.generateAccessToken(
                user.getEmail(), Map.of("role", user.getRole().name()));

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(request.getRefreshToken())
                .tokenType("Bearer")
                .role(user.getRole())
                .profileComplete(isProfileComplete(user))
                .userId(user.getId().toString())
                .build();
    }

    private boolean isProfileComplete(User user) {
        return switch (user.getRole()) {
            case TEACHER -> teacherProfileRepository.existsByUserId(user.getId());
            case SCHOOL  -> schoolRepository.existsByUserId(user.getId());
            case ADMIN   -> true;
        };
    }
}
