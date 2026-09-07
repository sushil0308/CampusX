package com.campusx.interview;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

public class InterviewDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScheduleInterviewRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;
        @NotBlank(message = "Round name is required")
        private String roundName;
        private Interview.InterviewType interviewType;
        @NotNull(message = "Scheduled time is required")
        private LocalDateTime scheduledAt;
        private Integer durationMinutes;
        private String meetingLink;
        private String location;
        private String interviewerName;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateInterviewRequest {
        private Interview.InterviewStatus status;
        private String feedback;
    }
}
