package com.ghteacher.recruiting.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ghteacher.recruiting.dto.request.SubscriptionInitRequest;
import com.ghteacher.recruiting.dto.request.SubscriptionVerifyRequest;
import com.ghteacher.recruiting.dto.response.PaystackInitResponse;
import com.ghteacher.recruiting.dto.response.SubscriptionResponse;
import com.ghteacher.recruiting.service.PaystackService;
import com.ghteacher.recruiting.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@Slf4j
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final PaystackService paystackService;
    private final ObjectMapper objectMapper;

    @PostMapping("/initialize")
    public ResponseEntity<PaystackInitResponse> initializeSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubscriptionInitRequest request) {

        return ResponseEntity.ok(
                subscriptionService.initializeSubscription(userDetails.getUsername(), request));
    }

    @PostMapping("/verify")
    public ResponseEntity<SubscriptionResponse> verifySubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SubscriptionVerifyRequest request) {

        return ResponseEntity.ok(
                subscriptionService.verifySubscription(userDetails.getUsername(), request));
    }

    @GetMapping("/status")
    public ResponseEntity<SubscriptionResponse> getSubscriptionStatus(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(subscriptionService.getSubscriptionStatus(userDetails.getUsername()));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Void> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "x-paystack-signature", required = false) String signature) {

        if (signature == null || !paystackService.verifyWebhookSignature(payload, signature)) {
            log.warn("Rejected Paystack webhook: invalid signature");
            return ResponseEntity.ok().build();
        }

        try {
            JsonNode root = objectMapper.readTree(payload);
            String event = root.path("event").asText();
            JsonNode data = root.path("data");
            subscriptionService.handleWebhookEvent(event, data);
        } catch (Exception e) {
            log.error("Error processing Paystack webhook: {}", e.getMessage(), e);
        }

        return ResponseEntity.ok().build();
    }
}
