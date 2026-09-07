package com.campusx.admin;

import com.campusx.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class AdminDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdminDashboardStats {
        private long totalUsers;
        private long activeUsers;
        private Map<String, Long> roleDistribution;
        private long totalDrives;
        private long totalCompanies;
        private List<AuditLog> recentLogs;
    }
}
