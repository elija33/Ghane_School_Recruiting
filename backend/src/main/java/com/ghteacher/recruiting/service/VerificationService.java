package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.dto.request.VerificationResultRequest;
import com.ghteacher.recruiting.dto.response.VerificationRequestResponse;
import com.ghteacher.recruiting.entity.TeacherProfile;
import com.ghteacher.recruiting.entity.VerificationRequest;
import com.ghteacher.recruiting.enums.*;
import com.ghteacher.recruiting.exception.BusinessException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.TeacherProfileRepository;
import com.ghteacher.recruiting.repository.VerificationRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final VerificationRequestRepository verificationRequestRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final PremblyService premblyService;
    private final EtxNgService etxNgService;
    private final NotificationService notificationService;

    @Transactional
    public VerificationRequestResponse initiateEducationVerification(UUID teacherId) {
        TeacherProfile teacher = getTeacher(teacherId);

        VerificationRequest verReq = VerificationRequest.builder()
                .teacher(teacher)
                .type(VerificationType.EDUCATION)
                .provider(VerificationProvider.ETX_NG)
                .status(VerificationRequestStatus.IN_PROGRESS)
                .build();

        verReq = verificationRequestRepository.save(verReq);

        teacher.setVerificationStatus(VerificationStatus.IN_REVIEW);
        teacherProfileRepository.save(teacher);

        performEducationVerificationAsync(verReq.getId(), teacher.getId());

        log.info("Education verification initiated for teacher {}", teacherId);
        return toResponse(verReq);
    }

    @Transactional
    public VerificationRequestResponse initiateCriminalCheck(UUID teacherId) {
        TeacherProfile teacher = getTeacher(teacherId);

        if (teacher.getIdNumber() == null || teacher.getIdNumber().isBlank()) {
            throw new BusinessException("Teacher ID number is required for criminal background check");
        }

        VerificationRequest verReq = VerificationRequest.builder()
                .teacher(teacher)
                .type(VerificationType.CRIMINAL)
                .provider(VerificationProvider.PREMBLY)
                .status(VerificationRequestStatus.IN_PROGRESS)
                .build();

        verReq = verificationRequestRepository.save(verReq);
        performCriminalCheckAsync(verReq.getId(), teacher.getId());

        log.info("Criminal background check initiated for teacher {}", teacherId);
        return toResponse(verReq);
    }

    @Async("taskExecutor")
    @Transactional
    public void performEducationVerificationAsync(UUID verReqId, UUID teacherId) {
        VerificationRequest verReq = verificationRequestRepository.findById(verReqId).orElseThrow();
        TeacherProfile teacher = getTeacher(teacherId);

        try {
            VerificationResult result = etxNgService.verifyEducationCredentials(teacher);
            completeVerification(verReq, result, teacher, null);
        } catch (Exception e) {
            log.error("Education verification failed for teacher {}: {}", teacherId, e.getMessage());
            verReq.setStatus(VerificationRequestStatus.FAILED);
            verReq.setNotes("Verification failed: " + e.getMessage() + ". Flagged for manual review.");
            verReq.setResult(VerificationResult.UNVERIFIED);
            verReq.setCompletedAt(Instant.now());
            verificationRequestRepository.save(verReq);
        }
    }

    @Async("taskExecutor")
    @Transactional
    public void performCriminalCheckAsync(UUID verReqId, UUID teacherId) {
        VerificationRequest verReq = verificationRequestRepository.findById(verReqId).orElseThrow();
        TeacherProfile teacher = getTeacher(teacherId);

        try {
            VerificationResult result = premblyService.performCriminalCheck(teacher);
            completeVerification(verReq, result, teacher, null);
        } catch (Exception e) {
            log.error("Criminal check failed for teacher {}: {}", teacherId, e.getMessage());
            verReq.setStatus(VerificationRequestStatus.FAILED);
            verReq.setNotes("Check failed: " + e.getMessage());
            verReq.setResult(VerificationResult.UNVERIFIED);
            verReq.setCompletedAt(Instant.now());
            verificationRequestRepository.save(verReq);
        }
    }

    @Transactional
    public VerificationRequestResponse updateVerificationResult(UUID verificationId,
                                                                 VerificationResultRequest request) {
        VerificationRequest verReq = verificationRequestRepository.findById(verificationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Verification request", "id", verificationId));

        TeacherProfile teacher = verReq.getTeacher();
        completeVerification(verReq, request.getResult(), teacher, request.getNotes());

        return toResponse(verificationRequestRepository.findById(verificationId).orElseThrow());
    }

    @Transactional(readOnly = true)
    public List<VerificationRequestResponse> getTeacherVerifications(UUID teacherId) {
        getTeacher(teacherId); // validate teacher exists
        return verificationRequestRepository.findByTeacherId(teacherId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void completeVerification(VerificationRequest verReq, VerificationResult result,
                                       TeacherProfile teacher, String notes) {
        verReq.setStatus(VerificationRequestStatus.COMPLETED);
        verReq.setResult(result);
        verReq.setCompletedAt(Instant.now());
        if (notes != null) verReq.setNotes(notes);
        verificationRequestRepository.save(verReq);

        updateTeacherVerificationStatus(teacher);

        notificationService.sendNotification(
                teacher.getUser().getId(),
                "Verification Update",
                String.format("Your %s verification is complete. Result: %s",
                        verReq.getType().name().toLowerCase(), result.name())
        );
    }

    private void updateTeacherVerificationStatus(TeacherProfile teacher) {
        List<VerificationRequest> allRequests = verificationRequestRepository.findByTeacherId(teacher.getId());

        boolean educationPassed = allRequests.stream()
                .filter(r -> r.getType() == VerificationType.EDUCATION)
                .anyMatch(r -> r.getResult() == VerificationResult.VERIFIED);

        boolean criminalPassed = allRequests.stream()
                .filter(r -> r.getType() == VerificationType.CRIMINAL)
                .anyMatch(r -> r.getResult() == VerificationResult.VERIFIED);

        boolean anyFlagged = allRequests.stream()
                .anyMatch(r -> r.getResult() == VerificationResult.FLAGGED);

        if (anyFlagged) {
            teacher.setVerificationStatus(VerificationStatus.FAILED);
            teacher.setVisibleToSchools(false);
        } else if (educationPassed && criminalPassed) {
            teacher.setVerificationStatus(VerificationStatus.VERIFIED);
            teacher.setVisibleToSchools(true);
        } else {
            teacher.setVerificationStatus(VerificationStatus.IN_REVIEW);
        }

        teacherProfileRepository.save(teacher);
    }

    private TeacherProfile getTeacher(UUID teacherId) {
        return teacherProfileRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher profile", "id", teacherId));
    }

    private VerificationRequestResponse toResponse(VerificationRequest vr) {
        return VerificationRequestResponse.builder()
                .id(vr.getId())
                .teacherId(vr.getTeacher().getId())
                .teacherName(vr.getTeacher().getFullName())
                .type(vr.getType())
                .provider(vr.getProvider())
                .status(vr.getStatus())
                .result(vr.getResult())
                .notes(vr.getNotes())
                .requestedAt(vr.getRequestedAt())
                .completedAt(vr.getCompletedAt())
                .build();
    }
}
