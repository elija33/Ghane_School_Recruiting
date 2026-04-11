package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.VerificationProvider;
import com.ghteacher.recruiting.enums.VerificationRequestStatus;
import com.ghteacher.recruiting.enums.VerificationResult;
import com.ghteacher.recruiting.enums.VerificationType;
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
public class VerificationRequestResponse {

    private UUID id;
    private UUID teacherId;
    private String teacherName;
    private VerificationType type;
    private VerificationProvider provider;
    private VerificationRequestStatus status;
    private VerificationResult result;
    private String notes;
    private Instant requestedAt;
    private Instant completedAt;
}
