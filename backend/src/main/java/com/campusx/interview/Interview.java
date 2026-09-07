package com.campusx.interview;

import com.campusx.application.Application;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews", indexes = {
        @Index(name = "idx_interview_app", columnList = "application_id"),
        @Index(name = "idx_interview_scheduled", columnList = "scheduled_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @NotBlank
    @Column(name = "round_name", nullable = false, length = 100)
    private String roundName; // e.g. Technical Round 1, System Design, HR Discussion

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "interview_type", length = 30)
    private InterviewType interviewType = InterviewType.ONLINE;

    @NotNull
    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Builder.Default
    @Column(name = "duration_minutes")
    private Integer durationMinutes = 45;

    @Column(name = "meeting_link", length = 300)
    private String meetingLink;

    @Column(length = 150)
    private String location;

    @Column(name = "interviewer_name", length = 100)
    private String interviewerName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private InterviewStatus status = InterviewStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum InterviewType {
        ONLINE,
        IN_PERSON,
        PHONE
    }

    public enum InterviewStatus {
        SCHEDULED,
        COMPLETED,
        CANCELLED,
        RESCHEDULED
    }
}
