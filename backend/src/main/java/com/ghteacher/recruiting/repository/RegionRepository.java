package com.ghteacher.recruiting.repository;

import com.ghteacher.recruiting.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegionRepository extends JpaRepository<Region, UUID> {
    List<Region> findAllByOrderByNameAsc();
    Optional<Region> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
