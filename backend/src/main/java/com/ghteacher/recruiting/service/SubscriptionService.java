package com.ghteacher.recruiting.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.ghteacher.recruiting.dto.request.SubscriptionInitRequest;
import com.ghteacher.recruiting.dto.request.SubscriptionVerifyRequest;
import com.ghteacher.recruiting.dto.response.PaystackInitResponse;
import com.ghteacher.recruiting.dto.response.SubscriptionResponse;
import com.ghteacher.recruiting.entity.School;
import com.ghteacher.recruiting.entity.Subscription;
import com.ghteacher.recruiting.entity.User;
import com.ghteacher.recruiting.enums.SubscriptionStatus;
import com.ghteacher.recruiting.enums.SubscriptionTier;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.SchoolRepository;
import com.ghteacher.recruiting.repository.SubscriptionRepository;
import com.ghteacher.recruiting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final PaystackService paystackService;
    private final NotificationService notificationService;

    @Transactional
    public PaystackInitResponse initializeSubscription(String email, SubscriptionInitRequest request) {
        School school = getSchoolByEmail(email);

        PaystackInitResponse paystackResponse = paystackService.initializeTransaction(
                email, request.getPlan());

        // Create a pending subscription record
        Subscription subscription = Subscription.builder()
                .school(school)
                .plan(request.getPlan())
                .amount(BigDecimal.valueOf(request.getPlan().getAmountInPesewas() / 100.0))
                .currency("GHS")
                .paystackReference(paystackResponse.getReference())
                .status(SubscriptionStatus.ACTIVE)
                .startDate(Instant.now())
                .endDate(Instant.now().plus(30, ChronoUnit.DAYS))
                .build();

        subscriptionRepository.save(subscription);
        log.info("Subscription initialized for school {}, plan: {}", school.getId(), request.getPlan());

        return paystackResponse;
    }

    @Transactional
    public SubscriptionResponse verifySubscription(String email, SubscriptionVerifyRequest request) {
        School school = getSchoolByEmail(email);

        Subscription subscription = subscriptionRepository.findByPaystackReference(request.getReference())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription", "reference", request.getReference()));

        if (!subscription.getSchool().getId().equals(school.getId())) {
            throw new BusinessException("Subscription reference does not belong to your school");
        }

        JsonNode transactionData = paystackService.verifyTransaction(request.getReference());
        String paystackStatus = transactionData.path("status").asText();

        if (!"success".equals(paystackStatus)) {
            throw new BusinessException("Payment was not successful. Status: " + paystackStatus);
        }

        String transactionId = transactionData.path("id").asText();
        activateSubscription(school, subscription, transactionId);

        log.info("Subscription activated for school {}: {}", school.getId(), subscription.getPlan());

        notificationService.sendNotification(
                school.getUser().getId(),
                "Subscription Activated",
                String.format("Your %s subscription has been activated. Valid until %s.",
                        subscription.getPlan().name(), subscription.getEndDate())
        );

        return toResponse(subscription);
    }

    @Transactional
    public void handleWebhookEvent(String eventType, JsonNode data) {
        switch (eventType) {
            case "charge.success" -> {
                String reference = data.path("reference").asText();
                subscriptionRepository.findByPaystackReference(reference).ifPresent(sub -> {
                    String transactionId = data.path("id").asText();
                    activateSubscription(sub.getSchool(), sub, transactionId);
                    log.info("Webhook: subscription activated for school {}", sub.getSchool().getId());
                });
            }
            case "subscription.disable" -> {
                String reference = data.path("subscription_code").asText();
                subscriptionRepository.findByPaystackReference(reference).ifPresent(sub -> {
                    sub.setStatus(SubscriptionStatus.CANCELLED);
                    subscriptionRepository.save(sub);
                    deactivateSchoolSubscription(sub.getSchool());
                    log.info("Webhook: subscription cancelled for school {}", sub.getSchool().getId());
                });
            }
            default -> log.debug("Unhandled Paystack webhook event: {}", eventType);
        }
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getSubscriptionStatus(String email) {
        School school = getSchoolByEmail(email);
        Optional<Subscription> active = subscriptionRepository
                .findBySchoolIdAndStatus(school.getId(), SubscriptionStatus.ACTIVE);

        return active.map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("No active subscription found"));
    }

    private void activateSubscription(School school, Subscription subscription, String transactionId) {
        subscription.setStatus(SubscriptionStatus.ACTIVE);
        subscription.setPaystackTransactionId(transactionId);
        subscription.setStartDate(Instant.now());
        subscription.setEndDate(Instant.now().plus(30, ChronoUnit.DAYS));
        subscriptionRepository.save(subscription);

        school.setSubscriptionActive(true);
        school.setSubscriptionTier(subscription.getPlan());
        school.setSubscriptionStart(subscription.getStartDate());
        school.setSubscriptionEnd(subscription.getEndDate());
        schoolRepository.save(school);
    }

    private void deactivateSchoolSubscription(School school) {
        school.setSubscriptionActive(false);
        school.setSubscriptionTier(null);
        school.setSubscriptionStart(null);
        school.setSubscriptionEnd(null);
        schoolRepository.save(school);
    }

    private School getSchoolByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return schoolRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("School profile not found"));
    }

    private SubscriptionResponse toResponse(Subscription s) {
        return SubscriptionResponse.builder()
                .id(s.getId())
                .schoolId(s.getSchool().getId())
                .plan(s.getPlan())
                .amount(s.getAmount())
                .currency(s.getCurrency())
                .paystackReference(s.getPaystackReference())
                .status(s.getStatus())
                .startDate(s.getStartDate())
                .endDate(s.getEndDate())
                .build();
    }
}
