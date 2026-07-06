package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.entity.Region;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.RegionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegionService {

    private static final List<String> DEFAULT_REGIONS = List.of(
        "Greater Accra", "Ashanti", "Western", "Central", "Eastern",
        "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
        "Oti", "Ahafo", "Bono East", "North East", "Savannah", "Western North"
    );

    private final RegionRepository regionRepository;

    @PostConstruct
    @Transactional
    public void seedDefaults() {
        for (String name : DEFAULT_REGIONS) {
            if (!regionRepository.existsByNameIgnoreCase(name)) {
                regionRepository.save(Region.builder().name(name).build());
            }
        }
        log.info("Region seeding complete ({} defaults checked)", DEFAULT_REGIONS.size());
    }

    @Transactional(readOnly = true)
    public List<String> getAllNames() {
        return regionRepository.findAllByOrderByNameAsc()
                .stream()
                .map(Region::getName)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Region> getAll() {
        return regionRepository.findAllByOrderByNameAsc();
    }

    @Transactional
    public Region create(String name) {
        String trimmed = name.trim();
        if (regionRepository.existsByNameIgnoreCase(trimmed)) {
            throw new DuplicateResourceException("Region '" + trimmed + "' already exists");
        }
        return regionRepository.save(Region.builder().name(trimmed).build());
    }

    @Transactional
    public void delete(UUID id) {
        if (!regionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Region", "id", id);
        }
        regionRepository.deleteById(id);
    }
}
