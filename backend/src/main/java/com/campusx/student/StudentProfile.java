package com.campusx.student;

import com.campusx.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_profiles", indexes = {
        @Index(name = "idx_student_roll", columnList = "roll_number"),
        @Index(name = "idx_student_dept", columnList = "department"),
        @Index(name = "idx_student_cgpa", columnList = "cgpa")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "roll_number", length = 30)
    private String rollNumber;

    @Column(length = 60)
    private String department; // e.g., CSE, ECE, MECH, IT, CIVIL

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "graduation_year")
    private Integer graduationYear; // e.g., 2025

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "github_url", length = 200)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 200)
    private String linkedinUrl;

    @Column(name = "portfolio_url", length = 200)
    private String portfolioUrl;

    @Builder.Default
    @Column(name = "is_placed", nullable = false)
    private boolean placed = false;

    @Builder.Default
    @Column(name = "placed_company", length = 100)
    private String placedCompany = null;

    @Builder.Default
    @Column(name = "placed_package_lpa")
    private Double placedPackageLpa = null;

    @Builder.Default
    @Column(name = "profile_completion_pct", nullable = false)
    private int profileCompletionPercentage = 20;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
