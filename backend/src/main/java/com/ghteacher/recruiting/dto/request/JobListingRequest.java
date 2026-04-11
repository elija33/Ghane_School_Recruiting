package com.ghteacher.recruiting.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
public class JobListingRequest {

    @NotBlank(message = "Job title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Subject is required")
    @Size(max = 255, message = "Subject must not exceed 255 characters")
    private String subject;

    @NotBlank(message = "Location is required")
    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @NotBlank(message = "Description is required")
    private String description;

    private String requirements;

    @Future(message = "Expiry date must be in the future")
    private Instant expiresAt;

    @Valid
    private List<ScreeningQuestionRequest> screeningQuestions = new ArrayList<>();

    @Data
    public static class ScreeningQuestionRequest {

        @NotBlank(message = "Question text is required")
        private String questionText;

        private int questionOrder;

        private boolean required = true;
    }
}
