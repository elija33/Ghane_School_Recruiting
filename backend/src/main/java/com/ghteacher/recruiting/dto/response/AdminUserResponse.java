package com.ghteacher.recruiting.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class AdminUserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String accessScope;
    private boolean isActive;
    private Instant createdAt;
}
