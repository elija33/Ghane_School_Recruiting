package com.ghteacher.recruiting.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghteacher.recruiting.entity.TeacherProfile;
import com.ghteacher.recruiting.enums.VerificationResult;
import com.ghteacher.recruiting.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PremblyService {

    private static final String PREMBLY_BASE_URL = "https://api.prembly.com/identitypass/verification/ghana";

    @Value("${prembly.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public VerificationResult performCriminalCheck(TeacherProfile teacher) {
        Map<String, Object> body = new HashMap<>();
        body.put("full_name", teacher.getFullName());
        body.put("id_number", teacher.getIdNumber());

        if (teacher.getDateOfBirth() != null) {
            body.put("date_of_birth", teacher.getDateOfBirth().toString());
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);
            headers.set("app-id", "ghteacher-platform");

            ResponseEntity<String> response = restTemplate.exchange(
                    PREMBLY_BASE_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            boolean success = root.path("status").asBoolean(false)
                    || "true".equalsIgnoreCase(root.path("status").asText());

            if (!success) {
                log.warn("Prembly returned failure for teacher {}: {}",
                        teacher.getId(), root.path("message").asText());
                return VerificationResult.UNVERIFIED;
            }

            JsonNode verificationData = root.path("verification");
            String status = verificationData.path("status").asText("failed").toLowerCase();

            return switch (status) {
                case "verified", "found", "success" -> VerificationResult.VERIFIED;
                case "flagged", "criminal_record" -> VerificationResult.FLAGGED;
                default -> VerificationResult.UNVERIFIED;
            };

        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Prembly criminal check failed for teacher {}: {}", teacher.getId(), e.getMessage(), e);
            throw new ExternalServiceException("Prembly", "Criminal background check failed: " + e.getMessage());
        }
    }
}
