package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.dto.response.AdminAnalyticsResponse;
import com.ghteacher.recruiting.dto.response.SchoolProfileResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.entity.TeacherProfile;
import com.ghteacher.recruiting.enums.SubscriptionStatus;
import com.ghteacher.recruiting.enums.VerificationStatus;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final TeacherProfileRepository teacherProfileRepository;
    private final SchoolRepository schoolRepository;
    private final JobListingRepository jobListingRepository;
    private final ApplicationRepository applicationRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<TeacherProfileResponse> getAllTeachers(VerificationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return teacherProfileRepository.findAllWithFilters(status, pageable)
                .map(this::toTeacherResponse);
    }

    @Transactional
    public TeacherProfileResponse approveTeacher(UUID teacherId) {
        TeacherProfile teacher = getTeacher(teacherId);

        if (teacher.getVerificationStatus() == VerificationStatus.VERIFIED) {
            throw new BusinessException("Teacher profile is already verified");
        }

        teacher.setVerificationStatus(VerificationStatus.VERIFIED);
        teacher.setVisibleToSchools(true);
        teacherProfileRepository.save(teacher);

        notificationService.sendNotification(
                teacher.getUser().getId(),
                "Profile Approved",
                "Congratulations! Your teacher profile has been approved and is now visible to schools."
        );

        log.info("Admin approved teacher profile: {}", teacherId);
        return toTeacherResponse(teacher);
    }

    @Transactional
    public TeacherProfileResponse rejectTeacher(UUID teacherId, String reason) {
        TeacherProfile teacher = getTeacher(teacherId);

        teacher.setVerificationStatus(VerificationStatus.FAILED);
        teacher.setVisibleToSchools(false);
        teacherProfileRepository.save(teacher);

        String message = reason != null && !reason.isBlank()
                ? "Your teacher profile has been rejected. Reason: " + reason
                : "Your teacher profile has been rejected. Please contact support for more information.";

        notificationService.sendNotification(
                teacher.getUser().getId(),
                "Profile Rejected",
                message
        );

        log.info("Admin rejected teacher profile: {} - reason: {}", teacherId, reason);
        return toTeacherResponse(teacher);
    }

    @Transactional(readOnly = true)
    public Page<SchoolProfileResponse> getAllSchools(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return schoolRepository.findAllBy(pageable)
                .map(s -> SchoolProfileResponse.builder()
                        .id(s.getId())
                        .userId(s.getUser().getId())
                        .email(s.getUser().getEmail())
                        .schoolName(s.getSchoolName())
                        .location(s.getLocation())
                        .contactPerson(s.getContactPerson())
                        .phoneNumber(s.getPhoneNumber())
                        .subscriptionTier(s.getSubscriptionTier())
                        .subscriptionStart(s.getSubscriptionStart())
                        .subscriptionEnd(s.getSubscriptionEnd())
                        .isSubscriptionActive(s.isSubscriptionActive())
                        .createdAt(s.getCreatedAt())
                        .build());
    }

    @Transactional(readOnly = true)
    public AdminAnalyticsResponse getAnalytics() {
        return AdminAnalyticsResponse.builder()
                .totalTeachers(teacherProfileRepository.count())
                .verifiedTeachers(teacherProfileRepository.countByVerificationStatus(VerificationStatus.VERIFIED))
                .pendingVerificationTeachers(teacherProfileRepository.countByVerificationStatus(VerificationStatus.PENDING))
                .totalSchools(schoolRepository.count())
                .activeSubscriptions(subscriptionRepository.countByStatus(SubscriptionStatus.ACTIVE))
                .totalJobPostings(jobListingRepository.count())
                .totalApplications(applicationRepository.count())
                .build();
    }

    private TeacherProfile getTeacher(UUID teacherId) {
        return teacherProfileRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile", "id", teacherId));
    }

    private TeacherProfileResponse toTeacherResponse(TeacherProfile p) {
        return TeacherProfileResponse.builder()
                .id(p.getId())
                .userId(p.getUser().getId())
                .email(p.getUser().getEmail())
                .fullName(p.getFullName())
                .phoneNumber(p.getPhoneNumber())
                .location(p.getLocation())
                .subjectSpecialization(p.getSubjectSpecialization())
                .yearsOfExperience(p.getYearsOfExperience())
                .resumeUrl(p.getResumeUrl())
                .photoUrl(p.getPhotoUrl())
                .videoUrl(p.getVideoUrl())
                .bio(p.getBio())
                .verificationStatus(p.getVerificationStatus())
                .isVisibleToSchools(p.isVisibleToSchools())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
