package com.ghteacher.recruiting.dto.request;

import com.ghteacher.recruiting.enums.VerificationResult;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VerificationResultRequest {

    @NotNull(message = "Result is required")
    private VerificationResult result;

    private String notes;
}
