package com.campusx.auth.dto;

import com.campusx.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long userId;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String fullName;
    private Long profileId;
    private String companyName;
}
