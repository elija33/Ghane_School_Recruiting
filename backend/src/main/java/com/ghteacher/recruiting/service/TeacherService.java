package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.dto.request.ApplicationRequest;
import com.ghteacher.recruiting.dto.request.TeacherProfileRequest;
import com.ghteacher.recruiting.dto.response.ApplicationResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.entity.*;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TeacherService {

    private final TeacherProfileRepository teacherProfileRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final JobListingRepository jobListingRepository;
    private final ScreeningQuestionRepository screeningQuestionRepository;
    private final ScreeningAnswerRepository screeningAnswerRepository;
    private final CloudinaryService cloudinaryService;

    @Transactional
    public TeacherProfileResponse createProfile(String email, TeacherProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (teacherProfileRepository.existsByUserId(user.getId())) {
            throw new DuplicateResourceException("Teacher profile already exists for this account");
        }

        TeacherProfile profile = TeacherProfile.builder()
                .user(user)
                .fullName(sanitize(request.getFullName()))
                .phoneNumber(request.getPhoneNumber())
                .location(sanitize(request.getLocation()))
                .subjectSpecialization(sanitize(request.getSubjectSpecialization()))
                .yearsOfExperience(request.getYearsOfExperience())
                .bio(sanitize(request.getBio()))
                .dateOfBirth(request.getDateOfBirth())
                .idNumber(request.getIdNumber())
                .build();

        return toResponse(teacherProfileRepository.save(profile));
    }

    @Transactional
    public TeacherProfileResponse updateProfile(String email, TeacherProfileRequest request) {
        TeacherProfile profile = getProfileByEmail(email);

        if (request.getFullName() != null)             profile.setFullName(sanitize(request.getFullName()));
        if (request.getPhoneNumber() != null)          profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getLocation() != null)             profile.setLocation(sanitize(request.getLocation()));
        if (request.getSubjectSpecialization() != null) profile.setSubjectSpecialization(sanitize(request.getSubjectSpecialization()));
        if (request.getYearsOfExperience() != null)   profile.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getBio() != null)                  profile.setBio(sanitize(request.getBio()));
        if (request.getDateOfBirth() != null)          profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getIdNumber() != null)             profile.setIdNumber(request.getIdNumber());

        return toResponse(teacherProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public TeacherProfileResponse getProfile(String email) {
        return toResponse(getProfileByEmail(email));
    }

    @Transactional
    public TeacherProfileResponse uploadResume(String email, MultipartFile file) {
        TeacherProfile profile = getProfileByEmail(email);
        String url = cloudinaryService.uploadResume(file);
        profile.setResumeUrl(url);
        return toResponse(teacherProfileRepository.save(profile));
    }

    @Transactional
    public TeacherProfileResponse uploadPhoto(String email, MultipartFile file) {
        TeacherProfile profile = getProfileByEmail(email);
        String url = cloudinaryService.uploadPhoto(file);
        profile.setPhotoUrl(url);
        return toResponse(teacherProfileRepository.save(profile));
    }

    @Transactional
    public TeacherProfileResponse uploadVideo(String email, MultipartFile file) {
        TeacherProfile profile = getProfileByEmail(email);
        String url = cloudinaryService.uploadVideo(file);
        profile.setVideoUrl(url);
        return toResponse(teacherProfileRepository.save(profile));
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplications(String email) {
        TeacherProfile profile = getProfileByEmail(email);
        return applicationRepository.findByTeacherId(profile.getId())
                .stream()
                .map(this::toApplicationResponse)
                .toList();
    }

    @Transactional
    public ApplicationResponse applyForJob(String email, UUID jobListingId, ApplicationRequest request) {
        TeacherProfile profile = getProfileByEmail(email);

        JobListing job = jobListingRepository.findById(jobListingId)
                .orElseThrow(() -> new ResourceNotFoundException("Job listing", "id", jobListingId));

        if (!job.isActive()) {
            throw new BusinessException("This job listing is no longer active");
        }

        if (applicationRepository.existsByTeacherIdAndJobListingId(profile.getId(), jobListingId)) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        // Validate required screening questions are answered
        List<ScreeningQuestion> requiredQuestions = screeningQuestionRepository
                .findByJobListingIdOrderByQuestionOrderAsc(jobListingId)
                .stream()
                .filter(ScreeningQuestion::isRequired)
                .toList();

        List<UUID> answeredQuestionIds = request.getScreeningAnswers()
                .stream()
                .map(ApplicationRequest.ScreeningAnswerRequest::getQuestionId)
                .toList();

        for (ScreeningQuestion required : requiredQuestions) {
            if (!answeredQuestionIds.contains(required.getId())) {
                throw new BusinessException("Required question not answered: " + required.getQuestionText());
            }
        }

        Application application = Application.builder()
                .teacher(profile)
                .jobListing(job)
                .build();

        application = applicationRepository.save(application);

        for (ApplicationRequest.ScreeningAnswerRequest answerReq : request.getScreeningAnswers()) {
            ScreeningQuestion question = screeningQuestionRepository.findById(answerReq.getQuestionId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Screening question", "id", answerReq.getQuestionId()));

            ScreeningAnswer answer = ScreeningAnswer.builder()
                    .application(application)
                    .question(question)
                    .answerText(sanitize(answerReq.getAnswerText()))
                    .build();

            screeningAnswerRepository.save(answer);
        }

        log.info("Teacher {} applied for job {}", profile.getId(), jobListingId);
        return toApplicationResponse(application);
    }

    private TeacherProfile getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        return teacherProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile not found"));
    }

    private TeacherProfileResponse toResponse(TeacherProfile p) {
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
                .dateOfBirth(p.getDateOfBirth())
                .idNumber(p.getIdNumber())
                .verificationStatus(p.getVerificationStatus())
                .isVisibleToSchools(p.isVisibleToSchools())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
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

    private String sanitize(String input) {
        if (input == null) return null;
        return input.trim()
                .replaceAll("<[^>]*>", "")   // strip HTML tags
                .replaceAll("[<>\"'&;]", ""); // strip dangerous chars
    }
}
