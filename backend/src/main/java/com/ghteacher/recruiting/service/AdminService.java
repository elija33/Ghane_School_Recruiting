package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.dto.request.CreateAdminRequest;
import com.ghteacher.recruiting.dto.response.AdminAnalyticsResponse;
import com.ghteacher.recruiting.dto.response.AdminUserResponse;
import com.ghteacher.recruiting.dto.response.JobListingResponse;
import com.ghteacher.recruiting.dto.response.SchoolProfileResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.entity.JobListing;
import com.ghteacher.recruiting.entity.TeacherProfile;
import com.ghteacher.recruiting.entity.User;
import com.ghteacher.recruiting.entity.School;
import com.ghteacher.recruiting.enums.RegistrationStatus;
import com.ghteacher.recruiting.enums.SubscriptionStatus;
import com.ghteacher.recruiting.enums.UserRole;
import com.ghteacher.recruiting.enums.VerificationStatus;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@ghteacher.com}")
    private String fromEmail;

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
        return schoolRepository.findAllBy(pageable).map(this::toSchoolProfileResponse);
    }

    @Transactional(readOnly = true)
    public List<JobListingResponse> getSchoolJobs(UUID schoolId) {
        return jobListingRepository.findBySchoolId(schoolId)
                .stream()
                .map(this::toJobListingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SchoolProfileResponse getSchoolById(UUID id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School", "id", id));
        return toSchoolProfileResponse(school);
    }

    @Transactional
    public SchoolProfileResponse approveSchool(UUID id) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School", "id", id));
        school.setRegistrationStatus(RegistrationStatus.APPROVED);
        School saved = schoolRepository.save(school);
        log.info("Admin approved school registration: {}", id);
        sendApprovalEmail(saved);
        return toSchoolProfileResponse(saved);
    }

    @Transactional
    public SchoolProfileResponse rejectSchool(UUID id, String reason) {
        School school = schoolRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("School", "id", id));
        school.setRegistrationStatus(RegistrationStatus.REJECTED);
        log.info("Admin rejected school registration: {} - reason: {}", id, reason);
        return toSchoolProfileResponse(schoolRepository.save(school));
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

    @Transactional
    public AdminUserResponse createAdmin(CreateAdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }
        String scope = request.getAccessScope() != null ? request.getAccessScope().toUpperCase() : "BOTH";
        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ADMIN)
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .accessScope(scope)
                .build();
        user = userRepository.save(user);
        log.info("Admin account created: {}", user.getEmail());
        return toAdminUserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<AdminUserResponse> listAdmins() {
        return userRepository.findAllByRoleOrderByCreatedAtDesc(UserRole.ADMIN)
                .stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    @Transactional
    public void removeAdmin(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user", "id", userId));
        if (user.getRole() != UserRole.ADMIN) {
            throw new BusinessException("User is not an admin");
        }
        userRepository.delete(user);
        log.info("Admin account removed: {}", user.getEmail());
    }

    private JobListingResponse toJobListingResponse(JobListing j) {
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

    private void sendApprovalEmail(School school) {
        String email = school.getUser().getEmail();
        String name = school.getSchoolName() != null ? school.getSchoolName() : "School";
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Account Approved – GH Teacher Recruiting");
            message.setText(
                    "Hello " + name + ",\n\n" +
                    "Your account has been created successfully. " +
                    "You can now log in and start posting jobs on GH Teacher Recruiting.\n\n" +
                    "Welcome aboard!\n\n" +
                    "The GH Teacher Recruiting Team"
            );
            mailSender.send(message);
            log.info("Approval email sent to {}", email);
        } catch (Exception e) {
            log.warn("Failed to send approval email to {} ({})", email, e.getMessage());
        }
    }

    private SchoolProfileResponse toSchoolProfileResponse(School s) {
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
                .registrationStatus(s.getRegistrationStatus() != null ? s.getRegistrationStatus() : RegistrationStatus.PENDING)
                .createdAt(s.getCreatedAt())
                .build();
    }

    private AdminUserResponse toAdminUserResponse(User u) {
        return AdminUserResponse.builder()
                .id(u.getId())
                .email(u.getEmail())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .accessScope(u.getAccessScope() != null ? u.getAccessScope() : "BOTH")
                .isActive(u.isActive())
                .createdAt(u.getCreatedAt())
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
