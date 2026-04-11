package com.ghteacher.recruiting.dto.request;

import com.ghteacher.recruiting.enums.SubscriptionTier;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubscriptionInitRequest {

    @NotNull(message = "Subscription plan is required")
    private SubscriptionTier plan;
}
