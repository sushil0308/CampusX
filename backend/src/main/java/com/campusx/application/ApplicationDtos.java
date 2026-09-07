package com.campusx.application;

import com.campusx.placement.PlacementDrive;
import com.campusx.student.StudentProfile;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class ApplicationDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplyRequest {
        @NotNull(message = "Placement drive ID is required")
        private Long driveId;
        private String coverNote;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StatusUpdateRequest {
        @NotNull(message = "New application status is required")
        private ApplicationStatus status;
        private String feedback;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplicationResponseDto {
        private Long id;
        private PlacementDrive placementDrive;
        private StudentProfile studentProfile;
        private String studentFullName;
        private String studentEmail;
        private String studentPhone;
        private ApplicationStatus status;
        private String coverNote;
        private LocalDateTime appliedAt;
        private LocalDateTime updatedAt;
    }
}
