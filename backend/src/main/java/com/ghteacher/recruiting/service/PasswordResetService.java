package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.entity.PasswordResetToken;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.PasswordResetTokenRepository;
import com.ghteacher.recruiting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Value("${app.base-url:http://localhost:8081}")
    private String appBaseUrl;

    @Value("${spring.mail.username:noreply@ghteacher.com}")
    private String fromEmail;

    @Transactional
    public void initiatePasswordReset(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        if (!userRepository.existsByEmail(normalizedEmail)) {
            throw new ResourceNotFoundException("Email not found: " + normalizedEmail);
        }

        // Remove any previous tokens for this email
        tokenRepository.deleteByEmail(normalizedEmail);

        String token = UUID.randomUUID().toString().replace("-", "");

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .email(normalizedEmail)
                .expiresAt(Instant.now().plusSeconds(3600))
                .build();

        tokenRepository.save(resetToken);

        String resetLink = appBaseUrl + "/reset-password?token=" + token;

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(normalizedEmail);
            message.setSubject("Ghana Teacher Recruiting — Password Reset");
            message.setText(
                "Hello,\n\n" +
                "You requested a password reset for your Ghana Teacher Recruiting account.\n\n" +
                "Click the link below to reset your password (expires in 1 hour):\n\n" +
                resetLink + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "— Ghana Teacher Recruiting Team"
            );
            mailSender.send(message);
            log.info("Password reset email sent to {}", normalizedEmail);
        } catch (Exception e) {
            // Log the reset link so it can be used during development without SMTP
            log.warn("Email sending failed ({}). DEV RESET LINK for {}: {}", e.getMessage(), normalizedEmail, resetLink);
        }
    }
}
