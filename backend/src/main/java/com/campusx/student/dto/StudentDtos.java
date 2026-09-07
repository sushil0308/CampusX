package com.campusx.student.dto;

import com.campusx.student.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

public class StudentDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProfileUpdateRequest {
        private String rollNumber;
        private String department;
        private Double cgpa;
        private Integer graduationYear;
        private String bio;
        private String githubUrl;
        private String linkedinUrl;
        private String portfolioUrl;
        private String resumeUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FullProfileResponse {
        private StudentProfile profile;
        private String email;
        private String firstName;
        private String lastName;
        private String phone;
        private List<Education> educations;
        private List<StudentSkill> skills;
        private List<Project> projects;
        private List<Internship> internships;
        private List<Certification> certifications;
        private List<Resume> resumes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationRequest {
        private String degree;
        private String institution;
        private String boardOrUniversity;
        private Integer startYear;
        private Integer endYear;
        private String score;
        private boolean completed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectRequest {
        private String title;
        private String description;
        private String technologies;
        private String githubUrl;
        private String liveUrl;
        private LocalDate startDate;
        private LocalDate endDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InternshipRequest {
        private String companyName;
        private String role;
        private String description;
        private String location;
        private LocalDate startDate;
        private LocalDate endDate;
        private String certificateUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationRequest {
        private String title;
        private String issuingOrganization;
        private LocalDate issueDate;
        private String credentialId;
        private String credentialUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AddSkillRequest {
        private String skillName;
        private String category;
        private StudentSkill.ProficiencyLevel proficiencyLevel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeUploadRequest {
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
        private boolean primary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private int profileCompletionPercentage;
        private long eligibleDrivesCount;
        private long appliedDrivesCount;
        private long upcomingInterviewsCount;
        private long offersReceivedCount;
        private boolean isPlaced;
        private String placedCompany;
        private Double placedPackageLpa;
    }
}
