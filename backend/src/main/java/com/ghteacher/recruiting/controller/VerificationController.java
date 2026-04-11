package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.dto.request.VerificationResultRequest;
import com.ghteacher.recruiting.dto.response.VerificationRequestResponse;
import com.ghteacher.recruiting.service.VerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping("/education/{teacherId}")
    public ResponseEntity<VerificationRequestResponse> initiateEducationVerification(
            @PathVariable UUID teacherId) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(verificationService.initiateEducationVerification(teacherId));
    }

    @PostMapping("/criminal/{teacherId}")
    public ResponseEntity<VerificationRequestResponse> initiateCriminalCheck(
            @PathVariable UUID teacherId) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(verificationService.initiateCriminalCheck(teacherId));
    }

    @PutMapping("/{verificationId}/result")
    public ResponseEntity<VerificationRequestResponse> updateVerificationResult(
            @PathVariable UUID verificationId,
            @Valid @RequestBody VerificationResultRequest request) {

        return ResponseEntity.ok(verificationService.updateVerificationResult(verificationId, request));
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<VerificationRequestResponse>> getTeacherVerifications(
            @PathVariable UUID teacherId) {

        return ResponseEntity.ok(verificationService.getTeacherVerifications(teacherId));
    }
}
