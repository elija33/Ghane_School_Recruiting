package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.entity.Subject;
import com.ghteacher.recruiting.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    /** Public — used by registration and school job-posting forms */
    @GetMapping
    public ResponseEntity<List<String>> getSubjectNames() {
        return ResponseEntity.ok(subjectService.getAllNames());
    }

    /** Admin — full list with IDs for management */
    @GetMapping("/admin")
    public ResponseEntity<List<Subject>> getAll() {
        return ResponseEntity.ok(subjectService.getAll());
    }

    /** Admin — add a new subject */
    @PostMapping("/admin")
    public ResponseEntity<Subject> create(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.create(name));
    }

    /** Admin — remove a subject */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        subjectService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
