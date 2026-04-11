package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.TeacherProfile;
import com.ghteacher.recruiting.enums.VerificationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, UUID> {

    Optional<TeacherProfile> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    Page<TeacherProfile> findByIsVisibleToSchoolsTrue(Pageable pageable);

    @Query("""
        SELECT t FROM TeacherProfile t
        WHERE t.isVisibleToSchools = true
        AND (:subject IS NULL OR LOWER(t.subjectSpecialization) LIKE LOWER(CONCAT('%', :subject, '%')))
        AND (:location IS NULL OR LOWER(t.location) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:minExperience IS NULL OR t.yearsOfExperience >= :minExperience)
        AND (:maxExperience IS NULL OR t.yearsOfExperience <= :maxExperience)
    """)
    Page<TeacherProfile> findVisibleTeachers(
        @Param("subject") String subject,
        @Param("location") String location,
        @Param("minExperience") Integer minExperience,
        @Param("maxExperience") Integer maxExperience,
        Pageable pageable
    );

    long countByVerificationStatus(VerificationStatus status);

    @Query("""
        SELECT t FROM TeacherProfile t
        LEFT JOIN FETCH t.user u
        WHERE (:status IS NULL OR t.verificationStatus = :status)
    """)
    Page<TeacherProfile> findAllWithFilters(
        @Param("status") VerificationStatus status,
        Pageable pageable
    );
}
