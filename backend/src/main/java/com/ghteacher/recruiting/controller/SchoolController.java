package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.dto.request.JobListingRequest;
import com.ghteacher.recruiting.dto.request.SchoolProfileRequest;
import com.ghteacher.recruiting.dto.request.UpdateApplicationStatusRequest;
import com.ghteacher.recruiting.dto.response.ApplicationResponse;
import com.ghteacher.recruiting.dto.response.JobListingResponse;
import com.ghteacher.recruiting.dto.response.SchoolProfileResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.service.SchoolService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/schools")
@RequiredArgsConstructor
public class SchoolController {

    private final SchoolService schoolService;

    @PostMapping("/profile")
    public ResponseEntity<SchoolProfileResponse> createProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SchoolProfileRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(schoolService.createProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/profile")
    public ResponseEntity<SchoolProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SchoolProfileRequest request) {

        return ResponseEntity.ok(schoolService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/profile")
    public ResponseEntity<SchoolProfileResponse> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(schoolService.getProfile(userDetails.getUsername()));
    }

    @PostMapping("/jobs")
    public ResponseEntity<JobListingResponse> createJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobListingRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(schoolService.createJob(userDetails.getUsername(), request));
    }

    @PutMapping("/jobs/{jobId}")
    public ResponseEntity<JobListingResponse> updateJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID jobId,
            @Valid @RequestBody JobListingRequest request) {

        return ResponseEntity.ok(schoolService.updateJob(userDetails.getUsername(), jobId, request));
    }

    @DeleteMapping("/jobs/{jobId}")
    public ResponseEntity<Void> deactivateJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID jobId) {

        schoolService.deactivateJob(userDetails.getUsername(), jobId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobListingResponse>> getSchoolJobs(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(schoolService.getSchoolJobs(userDetails.getUsername()));
    }

    @GetMapping("/teachers")
    public ResponseEntity<Page<TeacherProfileResponse>> browseTeachers(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(required = false) Integer maxExperience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(schoolService.browseTeachers(
                userDetails.getUsername(), subject, location, minExperience, maxExperience, page, size));
    }

    @GetMapping("/teachers/{teacherId}")
    public ResponseEntity<TeacherProfileResponse> getTeacherProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID teacherId) {

        return ResponseEntity.ok(schoolService.getTeacherProfile(userDetails.getUsername(), teacherId));
    }

    @GetMapping("/applications/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsForJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID jobId) {

        return ResponseEntity.ok(schoolService.getApplicationsForJob(userDetails.getUsername(), jobId));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable UUID applicationId,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {

        return ResponseEntity.ok(schoolService.updateApplicationStatus(
                userDetails.getUsername(), applicationId, request));
    }
}
