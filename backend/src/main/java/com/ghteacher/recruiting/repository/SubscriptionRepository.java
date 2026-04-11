package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.Subscription;
import com.ghteacher.recruiting.enums.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    List<Subscription> findBySchoolId(UUID schoolId);

    Optional<Subscription> findBySchoolIdAndStatus(UUID schoolId, SubscriptionStatus status);

    Optional<Subscription> findByPaystackReference(String reference);

    long countByStatus(SubscriptionStatus status);
}
