package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.ScreeningQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScreeningQuestionRepository extends JpaRepository<ScreeningQuestion, UUID> {

    List<ScreeningQuestion> findByJobListingIdOrderByQuestionOrderAsc(UUID jobListingId);

    void deleteByJobListingId(UUID jobListingId);
}
