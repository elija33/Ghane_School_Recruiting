package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.ApplicationStatus;
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
public class ApplicationResponse {

    private UUID id;
    private UUID teacherId;
    private String teacherName;
    private String teacherEmail;
    private String teacherPhotoUrl;
    private UUID jobListingId;
    private String jobTitle;
    private String schoolName;
    private ApplicationStatus status;
    private Instant appliedAt;
    private Instant updatedAt;
    private List<ScreeningAnswerResponse> screeningAnswers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScreeningAnswerResponse {
        private UUID questionId;
        private String questionText;
        private String answerText;
    }
}
