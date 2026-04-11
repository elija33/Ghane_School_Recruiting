package com.ghteacher.recruiting.entity;

import com.ghteacher.recruiting.enums.VerificationProvider;
import com.ghteacher.recruiting.enums.VerificationRequestStatus;
import com.ghteacher.recruiting.enums.VerificationResult;
import com.ghteacher.recruiting.enums.VerificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "verification_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private TeacherProfile teacher;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VerificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VerificationProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private VerificationRequestStatus status = VerificationRequestStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private VerificationResult result;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "requested_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant requestedAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;
}
