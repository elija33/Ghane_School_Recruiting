package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.JobListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobListingRepository extends JpaRepository<JobListing, UUID> {

    List<JobListing> findBySchoolId(UUID schoolId);

    List<JobListing> findBySchoolIdAndIsActiveTrue(UUID schoolId);

    @Query("""
        SELECT j FROM JobListing j
        WHERE j.isActive = true
        AND (j.expiresAt IS NULL OR j.expiresAt > :now)
        AND (:subject IS NULL OR LOWER(j.subject) LIKE LOWER(CONCAT('%', :subject, '%')))
        AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
    """)
    Page<JobListing> findActiveListings(
        @Param("now") Instant now,
        @Param("subject") String subject,
        @Param("location") String location,
        Pageable pageable
    );

    Optional<JobListing> findByIdAndSchoolId(UUID id, UUID schoolId);

    long count();
}
