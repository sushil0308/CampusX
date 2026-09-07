package com.campusx.admin;

import com.campusx.admin.AdminDtos.AdminDashboardStats;
import com.campusx.common.ApiResponse;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.company.CompanyRepository;
import com.campusx.placement.PlacementDriveRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.user.Role;
import com.campusx.user.User;
import com.campusx.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStats>> getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByActive(true);

        Map<String, Long> roleDistribution = new HashMap<>();
        for (Role r : Role.values()) {
            roleDistribution.put(r.name(), userRepository.countByRole(r));
        }

        AdminDashboardStats stats = AdminDashboardStats.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .roleDistribution(roleDistribution)
                .totalDrives(driveRepository.count())
                .totalCompanies(companyRepository.count())
                .recentLogs(auditLogService.getRecentLogs())
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userRepository.findAll()));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<User>> toggleUserStatus(
            @PathVariable Long id,
            @RequestParam boolean active,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setActive(active);
        User saved = userRepository.save(user);

        auditLogService.log("USER_STATUS_TOGGLED", currentUser.getEmail(), "User", id.toString(),
                "User " + user.getEmail() + " active status set to " + active, null);

        return ResponseEntity.ok(ApiResponse.success("User status updated", saved));
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        user.setRole(role);
        User saved = userRepository.save(user);

        auditLogService.log("USER_ROLE_UPDATED", currentUser.getEmail(), "User", id.toString(),
                "User " + user.getEmail() + " role updated to " + role, null);

        return ResponseEntity.ok(ApiResponse.success("User role updated", saved));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getRecentLogs()));
    }
}
