package com.campusx.placement;

import com.campusx.company.Company;
import com.campusx.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_drives", indexes = {
        @Index(name = "idx_drive_status", columnList = "status"),
        @Index(name = "idx_drive_deadline", columnList = "application_deadline")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "job_role", length = 100)
    private String jobRole; // e.g. Software Development Engineer, Cloud Engineer

    @Column(name = "job_location", length = 100)
    private String jobLocation; // e.g. Bangalore, Hyderabad, Remote

    @Builder.Default
    @Column(name = "job_type", length = 50)
    private String jobType = "Full-time";

    @Column(name = "package_lpa")
    private Double packageLpa; // e.g. 18.5 LPA

    @Builder.Default
    @Column(name = "min_cgpa")
    private Double minCgpa = 6.0;

    @Builder.Default
    @Column(name = "allowed_branches", length = 200)
    private String allowedBranches = "CSE,IT,ECE,EE,MECH,CIVIL";

    @Column(name = "graduation_year")
    private Integer graduationYear; // e.g. 2025

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false, length = 30)
    private DriveStatus status = DriveStatus.APPROVED;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
