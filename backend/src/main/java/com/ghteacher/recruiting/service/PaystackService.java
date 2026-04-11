package com.ghteacher.recruiting.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghteacher.recruiting.dto.response.PaystackInitResponse;
import com.ghteacher.recruiting.enums.SubscriptionTier;
import com.ghteacher.recruiting.exception.ExternalServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaystackService {

    private static final String PAYSTACK_BASE_URL = "https://api.paystack.co";

    @Value("${paystack.secret-key}")
    private String secretKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PaystackInitResponse initializeTransaction(String email, SubscriptionTier plan) {
        String reference = "GHTR-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();

        Map<String, Object> body = Map.of(
                "email", email,
                "amount", plan.getAmountInPesewas(),
                "currency", "GHS",
                "reference", reference,
                "metadata", Map.of("plan", plan.name())
        );

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    PAYSTACK_BASE_URL + "/transaction/initialize",
                    HttpMethod.POST,
                    new HttpEntity<>(body, buildHeaders()),
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            if (!root.path("status").asBoolean()) {
                throw new ExternalServiceException("Paystack",
                        root.path("message").asText("Transaction initialization failed"));
            }

            JsonNode data = root.path("data");
            return PaystackInitResponse.builder()
                    .authorizationUrl(data.path("authorization_url").asText())
                    .accessCode(data.path("access_code").asText())
                    .reference(data.path("reference").asText())
                    .build();

        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Paystack initialization failed: {}", e.getMessage(), e);
            throw new ExternalServiceException("Paystack", "Initialization failed: " + e.getMessage());
        }
    }

    public JsonNode verifyTransaction(String reference) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    PAYSTACK_BASE_URL + "/transaction/verify/" + reference,
                    HttpMethod.GET,
                    new HttpEntity<>(buildHeaders()),
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            if (!root.path("status").asBoolean()) {
                throw new ExternalServiceException("Paystack",
                        root.path("message").asText("Transaction verification failed"));
            }

            return root.path("data");

        } catch (ExternalServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Paystack verification failed for reference {}: {}", reference, e.getMessage(), e);
            throw new ExternalServiceException("Paystack", "Verification failed: " + e.getMessage());
        }
    }

    public boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA512"));
            byte[] computed = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computedHex = HexFormat.of().formatHex(computed);
            return computedHex.equals(signature);
        } catch (Exception e) {
            log.error("Webhook signature verification failed: {}", e.getMessage());
            return false;
        }
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + secretKey);
        return headers;
    }
}
