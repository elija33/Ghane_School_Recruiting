package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.SubscriptionStatus;
import com.ghteacher.recruiting.enums.SubscriptionTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {

    private UUID id;
    private UUID schoolId;
    private SubscriptionTier plan;
    private BigDecimal amount;
    private String currency;
    private String paystackReference;
    private SubscriptionStatus status;
    private Instant startDate;
    private Instant endDate;
}
