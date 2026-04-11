package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.dto.request.ApplicationRequest;
import com.ghteacher.recruiting.dto.request.TeacherProfileRequest;
import com.ghteacher.recruiting.dto.response.ApplicationResponse;
import com.ghteacher.recruiting.dto.response.JobListingResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.repository.JobListingRepository;
import com.ghteacher.recruiting.service.SchoolService;
import com.ghteacher.recruiting.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;
    private final JobListingRepository jobListingRepository;

    @PostMapping("/profile")
    public ResponseEntity<TeacherProfileResponse> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TeacherProfileRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teacherService.createProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/profile")
    public ResponseEntity<TeacherProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TeacherProfileRequest request) {

        return ResponseEntity.ok(teacherService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/profile")
    public ResponseEntity<TeacherProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(teacherService.getProfile(userDetails.getUsername()));
    }

    @PostMapping(value = "/upload/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeacherProfileResponse> uploadResume(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(teacherService.uploadResume(userDetails.getUsername(), file));
    }

    @PostMapping(value = "/upload/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeacherProfileResponse> uploadPhoto(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(teacherService.uploadPhoto(userDetails.getUsername(), file));
    }

    @PostMapping(value = "/upload/video", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TeacherProfileResponse> uploadVideo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(teacherService.uploadVideo(userDetails.getUsername(), file));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getApplications(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(teacherService.getApplications(userDetails.getUsername()));
    }

    @PostMapping("/apply/{jobListingId}")
    public ResponseEntity<ApplicationResponse> applyForJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID jobListingId,
            @Valid @RequestBody ApplicationRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teacherService.applyForJob(userDetails.getUsername(), jobListingId, request));
    }

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobListingResponse>> browseJobs(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var pageable = org.springframework.data.domain.PageRequest.of(page, size,
                org.springframework.data.domain.Sort.by("createdAt").descending());

        Page<JobListingResponse> jobs = jobListingRepository
                .findActiveListings(Instant.now(), subject, location, pageable)
                .map(j -> JobListingResponse.builder()
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
                        .build());

        return ResponseEntity.ok(jobs);
    }
}
