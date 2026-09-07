package com.campusx.officer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class OfficerDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BranchStat {
        private String branch;
        private long totalStudents;
        private long placedStudents;
        private double placementPercentage;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyPlacementStat {
        private String companyName;
        private Double packageLpa;
        private long offersCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfficerDashboardStats {
        private long totalStudents;
        private long placedStudents;
        private double placementPercentage;
        private long registeredCompanies;
        private long activeDrives;
        private long totalApplications;
        private Double averagePackageLpa;
        private Double highestPackageLpa;
        private List<BranchStat> branchWiseStats;
        private List<CompanyPlacementStat> topRecruiters;
    }
}
