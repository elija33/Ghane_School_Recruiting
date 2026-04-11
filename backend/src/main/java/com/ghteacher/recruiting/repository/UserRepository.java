package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.User;
import com.ghteacher.recruiting.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(UserRole role);

    long countByRoleAndIsActive(UserRole role, boolean isActive);
}
