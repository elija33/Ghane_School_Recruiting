package com.ghteacher.recruiting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobListingResponse {

    private UUID id;
    private UUID schoolId;
    private String schoolName;
    private String title;
    private String subject;
    private String location;
    private String description;
    private String requirements;
    private boolean isActive;
    private Instant createdAt;
    private Instant expiresAt;
    private List<ScreeningQuestionResponse> screeningQuestions;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScreeningQuestionResponse {
        private UUID id;
        private String questionText;
        private int questionOrder;
        private boolean isRequired;
    }
}
