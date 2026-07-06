package com.ghteacher.recruiting.service;

import com.ghteacher.recruiting.entity.Subject;
import com.ghteacher.recruiting.exception.DuplicateResourceException;
import com.ghteacher.recruiting.exception.ResourceNotFoundException;
import com.ghteacher.recruiting.repository.SubjectRepository;
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
public class SubjectService {

    private static final List<String> DEFAULT_SUBJECTS = List.of(
        "Mathematics", "English Language", "Science", "Social Studies", "ICT", "French",
        "Physical Education", "Music", "Art & Design", "Religious & Moral Education",
        "History", "Geography", "Economics", "Business Studies", "Agriculture", "Technical Drawing"
    );

    private final SubjectRepository subjectRepository;

    @PostConstruct
    @Transactional
    public void seedDefaults() {
        for (String name : DEFAULT_SUBJECTS) {
            if (!subjectRepository.existsByNameIgnoreCase(name)) {
                subjectRepository.save(Subject.builder().name(name).build());
            }
        }
        log.info("Subject seeding complete ({} defaults checked)", DEFAULT_SUBJECTS.size());
    }

    @Transactional(readOnly = true)
    public List<String> getAllNames() {
        return subjectRepository.findAllByOrderByNameAsc()
                .stream()
                .map(Subject::getName)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Subject> getAll() {
        return subjectRepository.findAllByOrderByNameAsc();
    }

    @Transactional
    public Subject create(String name) {
        String trimmed = name.trim();
        if (subjectRepository.existsByNameIgnoreCase(trimmed)) {
            throw new DuplicateResourceException("Subject '" + trimmed + "' already exists");
        }
        return subjectRepository.save(Subject.builder().name(trimmed).build());
    }

    @Transactional
    public void delete(UUID id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject", "id", id);
        }
        subjectRepository.deleteById(id);
    }
}
