package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.VerificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherProfileResponse {

    private UUID id;
    private UUID userId;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String location;
    private String subjectSpecialization;
    private Integer yearsOfExperience;
    private String resumeUrl;
    private String photoUrl;
    private String videoUrl;
    private String bio;
    private LocalDate dateOfBirth;
    private String idNumber;
    private VerificationStatus verificationStatus;
    private boolean isVisibleToSchools;
    private Instant createdAt;
    private Instant updatedAt;
}
