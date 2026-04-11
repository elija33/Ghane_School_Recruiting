package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.ScreeningAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScreeningAnswerRepository extends JpaRepository<ScreeningAnswer, UUID> {

    List<ScreeningAnswer> findByApplicationId(UUID applicationId);

    boolean existsByApplicationIdAndQuestionId(UUID applicationId, UUID questionId);
}
