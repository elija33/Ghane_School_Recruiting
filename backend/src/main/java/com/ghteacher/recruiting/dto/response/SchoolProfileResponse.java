package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.SubscriptionTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SchoolProfileResponse {

    private UUID id;
    private UUID userId;
    private String email;
    private String schoolName;
    private String location;
    private String contactPerson;
    private String phoneNumber;
    private SubscriptionTier subscriptionTier;
    private Instant subscriptionStart;
    private Instant subscriptionEnd;
    private boolean isSubscriptionActive;
    private Instant createdAt;
}
