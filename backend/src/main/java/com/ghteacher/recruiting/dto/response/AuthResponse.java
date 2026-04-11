package com.ghteacher.recruiting.dto.response;

import com.ghteacher.recruiting.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private UserRole role;
    private boolean profileComplete;
    private String userId;
}
