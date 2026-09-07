package com.campusx.placement;

import com.campusx.application.ApplicationStatus;
import com.campusx.company.Company;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DriveDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateDriveRequest {
        @NotBlank(message = "Job title is required")
        private String title;
        private String description;
        private String jobRole;
        private String jobLocation;
        private String jobType;
        private Double packageLpa;
        private Double minCgpa;
        private String allowedBranches;
        private Integer graduationYear;
        private LocalDate applicationDeadline;
        private Long companyId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriveResponseDto {
        private Long id;
        private String title;
        private String description;
        private String jobRole;
        private String jobLocation;
        private String jobType;
        private Double packageLpa;
        private Double minCgpa;
        private String allowedBranches;
        private Integer graduationYear;
        private LocalDate applicationDeadline;
        private DriveStatus status;
        private Company company;
        private LocalDateTime createdAt;
        private int totalApplicants;

        // Student-specific contextual fields
        private EligibilityResult eligibility;
        private boolean applied;
        private Long applicationId;
        private ApplicationStatus applicationStatus;
    }
}
