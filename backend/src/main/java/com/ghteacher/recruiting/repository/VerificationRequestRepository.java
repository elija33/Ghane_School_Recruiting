package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.VerificationRequest;
import com.ghteacher.recruiting.enums.VerificationResult;
import com.ghteacher.recruiting.enums.VerificationRequestStatus;
import com.ghteacher.recruiting.enums.VerificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, UUID> {

    List<VerificationRequest> findByTeacherId(UUID teacherId);

    Optional<VerificationRequest> findByTeacherIdAndType(UUID teacherId, VerificationType type);

    boolean existsByTeacherIdAndTypeAndResultNot(UUID teacherId, VerificationType type, VerificationResult result);

    List<VerificationRequest> findByTeacherIdAndStatus(UUID teacherId, VerificationRequestStatus status);

    boolean existsByTeacherIdAndTypeAndResult(UUID teacherId, VerificationType type, VerificationResult result);
}
