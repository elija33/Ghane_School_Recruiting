package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.dto.request.CreateAdminRequest;
import com.ghteacher.recruiting.dto.response.AdminAnalyticsResponse;
import com.ghteacher.recruiting.dto.response.AdminUserResponse;
import com.ghteacher.recruiting.dto.response.JobListingResponse;
import com.ghteacher.recruiting.dto.response.SchoolProfileResponse;
import com.ghteacher.recruiting.dto.response.TeacherProfileResponse;
import com.ghteacher.recruiting.enums.VerificationStatus;
import com.ghteacher.recruiting.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/teachers")
    public ResponseEntity<Page<TeacherProfileResponse>> getAllTeachers(
            @RequestParam(required = false) VerificationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(adminService.getAllTeachers(status, page, size));
    }

    @PutMapping("/teachers/{teacherId}/approve")
    public ResponseEntity<TeacherProfileResponse> approveTeacher(@PathVariable UUID teacherId) {
        return ResponseEntity.ok(adminService.approveTeacher(teacherId));
    }

    @PutMapping("/teachers/{teacherId}/reject")
    public ResponseEntity<TeacherProfileResponse> rejectTeacher(
            @PathVariable UUID teacherId,
            @RequestParam(required = false) String reason) {

        return ResponseEntity.ok(adminService.rejectTeacher(teacherId, reason));
    }

    @GetMapping("/schools")
    public ResponseEntity<Page<SchoolProfileResponse>> getAllSchools(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(adminService.getAllSchools(page, size));
    }

    @GetMapping("/schools/{schoolId}")
    public ResponseEntity<SchoolProfileResponse> getSchoolById(@PathVariable UUID schoolId) {
        return ResponseEntity.ok(adminService.getSchoolById(schoolId));
    }

    @GetMapping("/schools/{schoolId}/jobs")
    public ResponseEntity<List<JobListingResponse>> getSchoolJobs(@PathVariable UUID schoolId) {
        return ResponseEntity.ok(adminService.getSchoolJobs(schoolId));
    }

    @PutMapping("/schools/{schoolId}/approve")
    public ResponseEntity<SchoolProfileResponse> approveSchool(@PathVariable UUID schoolId) {
        return ResponseEntity.ok(adminService.approveSchool(schoolId));
    }

    @PutMapping("/schools/{schoolId}/reject")
    public ResponseEntity<SchoolProfileResponse> rejectSchool(
            @PathVariable UUID schoolId,
            @RequestParam(required = false) String reason) {

        return ResponseEntity.ok(adminService.rejectSchool(schoolId, reason));
    }

    @GetMapping("/analytics")
    public ResponseEntity<AdminAnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @PostMapping("/admins")
    public ResponseEntity<AdminUserResponse> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createAdmin(request));
    }

    @GetMapping("/admins")
    public ResponseEntity<List<AdminUserResponse>> listAdmins() {
        return ResponseEntity.ok(adminService.listAdmins());
    }

    @DeleteMapping("/admins/{userId}")
    public ResponseEntity<Void> removeAdmin(@PathVariable UUID userId) {
        adminService.removeAdmin(userId);
        return ResponseEntity.noContent().build();
    }
}
