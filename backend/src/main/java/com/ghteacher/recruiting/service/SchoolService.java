package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.dto.request.JobListingRequest;
import com.ghteacher.recruiting.dto.request.SchoolProfileRequest;
import com.ghteacher.recruiting.dto.request.UpdateApplicationStatusRequest;
import com.ghteacher.recruiting.dto.response.ApplicationResponse;
import com.ghteacher.recruiting.dto.response.JobListingResponse;
import com.ghteacher.recruiting.dto.response.SchoolProfileResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.entity.*;
import com.ghteacher.recruiting.enums.VerificationStatus;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.exception.SubscriptionRequiredException;
import com.ghteacher.recruiting.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class SchoolService {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final JobListingRepository jobListingRepository;
    private final ScreeningQuestionRepository screeningQuestionRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    @Transactional
    public SchoolProfileResponse createProfile(String email, SchoolProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (schoolRepository.existsByUserId(user.getId())) {
            throw new DuplicateResourceException("School profile already exists for this account");
        }

        School school = School.builder()
                .user(user)
                .schoolName(request.getSchoolName())
                .location(request.getLocation())
                .contactPerson(request.getContactPerson())
                .phoneNumber(request.getPhoneNumber())
                .build();

        return toSchoolResponse(schoolRepository.save(school));
    }

    @Transactional
    public SchoolProfileResponse updateProfile(String email, SchoolProfileRequest request) {
        School school = getSchoolByEmail(email);

        if (request.getSchoolName() != null)   school.setSchoolName(request.getSchoolName());
        if (request.getLocation() != null)      school.setLocation(request.getLocation());
        if (request.getContactPerson() != null) school.setContactPerson(request.getContactPerson());
        if (request.getPhoneNumber() != null)   school.setPhoneNumber(request.getPhoneNumber());

        return toSchoolResponse(schoolRepository.save(school));
    }

    @Transactional(readOnly = true)
    public SchoolProfileResponse getProfile(String email) {
        return toSchoolResponse(getSchoolByEmail(email));
    }

    @Transactional
    public JobListingResponse createJob(String email, JobListingRequest request) {
        School school = getSchoolByEmail(email);
        requireActiveSubscription(school);

        JobListing job = JobListing.builder()
                .school(school)
                .title(request.getTitle())
                .subject(request.getSubject())
                .location(request.getLocation())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .expiresAt(request.getExpiresAt())
                .build();

        job = jobListingRepository.save(job);

        for (int i = 0; i < request.getScreeningQuestions().size(); i++) {
            JobListingRequest.ScreeningQuestionRequest qReq = request.getScreeningQuestions().get(i);
            ScreeningQuestion q = ScreeningQuestion.builder()
                    .jobListing(job)
                    .questionText(qReq.getQuestionText())
                    .questionOrder(qReq.getQuestionOrder() > 0 ? qReq.getQuestionOrder() : i)
                    .isRequired(qReq.isRequired())
                    .build();
            screeningQuestionRepository.save(q);
        }

        log.info("School {} created job listing: {}", school.getId(), job.getId());
        return toJobResponse(jobListingRepository.findById(job.getId()).orElseThrow());
    }

    @Transactional
    public JobListingResponse updateJob(String email, UUID jobId, JobListingRequest request) {
        School school = getSchoolByEmail(email);
        JobListing job = jobListingRepository.findByIdAndSchoolId(jobId, school.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job listing", "id", jobId));

        if (request.getTitle() != null)        job.setTitle(request.getTitle());
        if (request.getSubject() != null)      job.setSubject(request.getSubject());
        if (request.getLocation() != null)     job.setLocation(request.getLocation());
        if (request.getDescription() != null)  job.setDescription(request.getDescription());
        if (request.getRequirements() != null) job.setRequirements(request.getRequirements());
        if (request.getExpiresAt() != null)    job.setExpiresAt(request.getExpiresAt());

        if (!request.getScreeningQuestions().isEmpty()) {
            screeningQuestionRepository.deleteByJobListingId(job.getId());
            for (int i = 0; i < request.getScreeningQuestions().size(); i++) {
                JobListingRequest.ScreeningQuestionRequest qReq = request.getScreeningQuestions().get(i);
                ScreeningQuestion q = ScreeningQuestion.builder()
                        .jobListing(job)
                        .questionText(qReq.getQuestionText())
                        .questionOrder(qReq.getQuestionOrder() > 0 ? qReq.getQuestionOrder() : i)
                        .isRequired(qReq.isRequired())
                        .build();
                screeningQuestionRepository.save(q);
            }
        }

        return toJobResponse(jobListingRepository.save(job));
    }

    @Transactional
    public void deactivateJob(String email, UUID jobId) {
        School school = getSchoolByEmail(email);
        JobListing job = jobListingRepository.findByIdAndSchoolId(jobId, school.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job listing", "id", jobId));

        job.setActive(false);
        jobListingRepository.save(job);
    }

    @Transactional(readOnly = true)
    public List<JobListingResponse> getSchoolJobs(String email) {
        School school = getSchoolByEmail(email);
        return jobListingRepository.findBySchoolId(school.getId())
                .stream()
                .map(this::toJobResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<TeacherProfileResponse> browseTeachers(String email,
                                                        String subject,
                                                        String location,
                                                        Integer minExperience,
                                                        Integer maxExperience,
                                                        int page, int size) {
        School school = getSchoolByEmail(email);
        requireActiveSubscription(school);

        Pageable pageable = PageRequest.of(page, size, Sort.by("fullName").ascending());
        return teacherProfileRepository
                .findVisibleTeachers(subject, location, minExperience, maxExperience, pageable)
                .map(this::toTeacherResponse);
    }

    @Transactional(readOnly = true)
    public TeacherProfileResponse getTeacherProfile(String email, UUID teacherId) {
        School school = getSchoolByEmail(email);
        requireActiveSubscription(school);

        TeacherProfile profile = teacherProfileRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile", "id", teacherId));

        if (!profile.isVisibleToSchools()) {
            throw new BusinessException("This teacher profile is not visible to schools");
        }

        return toTeacherResponse(profile);
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForJob(String email, UUID jobId) {
        School school = getSchoolByEmail(email);
        jobListingRepository.findByIdAndSchoolId(jobId, school.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Job listing", "id", jobId));

        return applicationRepository.findByJobListingIdWithTeacher(jobId)
                .stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse updateApplicationStatus(String email, UUID applicationId,
                                                        UpdateApplicationStatusRequest request) {
        School school = getSchoolByEmail(email);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        // Verify this application belongs to a job posted by this school
        if (!application.getJobListing().getSchool().getId().equals(school.getId())) {
            throw new BusinessException("Application does not belong to your school");
        }

        application.setStatus(request.getStatus());
        application = applicationRepository.save(application);

        // Notify teacher of status change
        String message = buildStatusNotificationMessage(application, request.getNote());
        notificationService.sendNotification(
                application.getTeacher().getUser().getId(),
                "Application Status Update",
                message
        );

        return toApplicationResponse(application);
    }

    private String buildStatusNotificationMessage(Application application, String note) {
        String base = String.format(
                "Your application for '%s' at %s has been updated to: %s",
                application.getJobListing().getTitle(),
                application.getJobListing().getSchool().getSchoolName(),
                application.getStatus().name().replace("_", " ")
        );
        return note != null && !note.isBlank() ? base + ". Note: " + note : base;
    }

    private void requireActiveSubscription(School school) {
        if (!school.isSubscriptionActive()) {
            throw new SubscriptionRequiredException();
        }
        if (school.getSubscriptionEnd() != null && school.getSubscriptionEnd().isBefore(Instant.now())) {
            throw new SubscriptionRequiredException("Your subscription has expired. Please renew.");
        }
    }

    private School getSchoolByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return schoolRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("School profile not found"));
    }

    private SchoolProfileResponse toSchoolResponse(School s) {
        return SchoolProfileResponse.builder()
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
                .build();
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
                .build();
    }

    private JobListingResponse toJobResponse(JobListing j) {
        return JobListingResponse.builder()
                .id(j.getId())
                .schoolId(j.getSchool().getId())
                .schoolName(j.getSchool().getSchoolName())
                .title(j.getTitle())
                .subject(j.getSubject())
                .location(j.getLocation())
                .description(j.getDescription())
                .requirements(j.getRequirements())
                .isActive(j.isActive())
                .createdAt(j.getCreatedAt())
                .expiresAt(j.getExpiresAt())
                .screeningQuestions(j.getScreeningQuestions().stream()
                        .map(q -> JobListingResponse.ScreeningQuestionResponse.builder()
                                .id(q.getId())
                                .questionText(q.getQuestionText())
                                .questionOrder(q.getQuestionOrder())
                                .isRequired(q.isRequired())
                                .build())
                        .toList())
                .build();
    }

    private ApplicationResponse toApplicationResponse(Application a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .teacherId(a.getTeacher().getId())
                .teacherName(a.getTeacher().getFullName())
                .teacherEmail(a.getTeacher().getUser().getEmail())
                .teacherPhotoUrl(a.getTeacher().getPhotoUrl())
                .jobListingId(a.getJobListing().getId())
                .jobTitle(a.getJobListing().getTitle())
                .schoolName(a.getJobListing().getSchool().getSchoolName())
                .status(a.getStatus())
                .appliedAt(a.getAppliedAt())
                .updatedAt(a.getUpdatedAt())
                .screeningAnswers(a.getScreeningAnswers().stream()
                        .map(ans -> ApplicationResponse.ScreeningAnswerResponse.builder()
                                .questionId(ans.getQuestion().getId())
                                .questionText(ans.getQuestion().getQuestionText())
                                .answerText(ans.getAnswerText())
                                .build())
                        .toList())
                .build();
    }
}
