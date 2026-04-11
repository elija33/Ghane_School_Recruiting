package com.ghteacher.recruiting.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SubscriptionVerifyRequest {

    @NotBlank(message = "Paystack reference is required")
    private String reference;
}
