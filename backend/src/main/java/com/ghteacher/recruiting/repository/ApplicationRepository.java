package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    List<Application> findByTeacherId(UUID teacherId);

    List<Application> findByJobListingId(UUID jobListingId);

    @Query("""
        SELECT a FROM Application a
        LEFT JOIN FETCH a.teacher t
        LEFT JOIN FETCH t.user u
        WHERE a.jobListing.id = :jobListingId
    """)
    List<Application> findByJobListingIdWithTeacher(@Param("jobListingId") UUID jobListingId);

    boolean existsByTeacherIdAndJobListingId(UUID teacherId, UUID jobListingId);

    Optional<Application> findByTeacherIdAndJobListingId(UUID teacherId, UUID jobListingId);

    long count();

    @Query("""
        SELECT a FROM Application a
        LEFT JOIN FETCH a.screeningAnswers sa
        LEFT JOIN FETCH sa.question q
        WHERE a.id = :id
    """)
    Optional<Application> findByIdWithAnswers(@Param("id") UUID id);
}
