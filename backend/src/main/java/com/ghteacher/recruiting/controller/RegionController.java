package com.ghteacher.recruiting.controller;

import com.ghteacher.recruiting.entity.Region;
import com.ghteacher.recruiting.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    /** Public — used by registration and school job-posting forms */
    @GetMapping
    public ResponseEntity<List<String>> getRegionNames() {
        return ResponseEntity.ok(regionService.getAllNames());
    }

    /** Admin — full list with IDs for management */
    @GetMapping("/admin")
    public ResponseEntity<List<Region>> getAll() {
        return ResponseEntity.ok(regionService.getAll());
    }

    /** Admin — add a new region */
    @PostMapping("/admin")
    public ResponseEntity<Region> create(@RequestBody Map<String, String> body) {
        String name = body.getOrDefault("name", "").trim();
        if (name.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(regionService.create(name));
    }

    /** Admin — remove a region */
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        regionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
