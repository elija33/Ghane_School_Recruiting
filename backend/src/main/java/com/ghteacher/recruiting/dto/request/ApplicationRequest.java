package com.ghteacher.recruiting.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
public class ApplicationRequest {

    @Valid
    private List<ScreeningAnswerRequest> screeningAnswers = new ArrayList<>();

    @Data
    public static class ScreeningAnswerRequest {

        @NotNull(message = "Question ID is required")
        private UUID questionId;

        @NotBlank(message = "Answer text is required")
        private String answerText;
    }
}
