package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.School;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SchoolRepository extends JpaRepository<School, UUID> {

    Optional<School> findByUserId(UUID userId);

    boolean existsByUserId(UUID userId);

    long countByIsSubscriptionActive(boolean active);

    Page<School> findAllBy(Pageable pageable);
}
