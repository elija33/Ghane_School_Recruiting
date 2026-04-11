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
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EtxNgService {

    private static final String ETXNG_BASE_URL = "https://api.etx.ng/v1/verify/education";

    @Value("${etxng.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Submits teacher credentials for education verification.
     * Returns UNVERIFIED if the API is unavailable, signaling that manual review is needed.
     */
    public VerificationResult verifyEducationCredentials(TeacherProfile teacher) {
        Map<String, Object> body = new HashMap<>();
        body.put("full_name", teacher.getFullName());
        body.put("institution_country", "GH");
        body.put("candidate_id", teacher.getId().toString());

        if (teacher.getDateOfBirth() != null) {
            body.put("date_of_birth", teacher.getDateOfBirth().toString());
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-api-key", apiKey);

            ResponseEntity<String> response = restTemplate.exchange(
                    ETXNG_BASE_URL,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            String status = root.path("status").asText("").toLowerCase();

            if ("pending".equals(status) || "submitted".equals(status)) {
                log.info("ETX.NG verification submitted for teacher {}; awaiting callback",
                        teacher.getId());
                return VerificationResult.UNVERIFIED;
            }

            String result = root.path("result").asText("").toLowerCase();
            return switch (result) {
                case "verified", "passed" -> VerificationResult.VERIFIED;
                case "flagged", "failed" -> VerificationResult.FLAGGED;
                default -> VerificationResult.UNVERIFIED;
            };

        } catch (RestClientException e) {
            log.warn("ETX.NG API unavailable for teacher {}; flagging for manual review: {}",
                    teacher.getId(), e.getMessage());
            // Return UNVERIFIED so admin can manually review
            return VerificationResult.UNVERIFIED;
        } catch (Exception e) {
            log.error("ETX.NG education verification failed for teacher {}: {}",
                    teacher.getId(), e.getMessage(), e);
            throw new ExternalServiceException("ETX.NG", "Education verification failed: " + e.getMessage());
        }
    }
}
