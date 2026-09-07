package com.campusx.placement;

import com.campusx.admin.AuditLogService;
import com.campusx.application.Application;
import com.campusx.application.ApplicationRepository;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.company.Company;
import com.campusx.company.CompanyRepository;
import com.campusx.notification.Notification;
import com.campusx.notification.NotificationService;
import com.campusx.placement.DriveDtos.*;
import com.campusx.recruiter.RecruiterProfile;
import com.campusx.recruiter.RecruiterProfileRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.student.StudentProfile;
import com.campusx.student.StudentProfileRepository;
import com.campusx.user.Role;
import com.campusx.user.User;
import com.campusx.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final EligibilityEngine eligibilityEngine;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<DriveResponseDto> getAllDrives(UserPrincipal currentUser) {
        List<PlacementDrive> drives = driveRepository.findAll();
        StudentProfile studentProfile = null;
        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            studentProfile = studentProfileRepository.findByUserId(currentUser.getId()).orElse(null);
        }

        final StudentProfile finalStudent = studentProfile;
        return drives.stream()
                .map(drive -> toDto(drive, finalStudent))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DriveResponseDto getDriveById(Long driveId, UserPrincipal currentUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        StudentProfile studentProfile = null;
        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            studentProfile = studentProfileRepository.findByUserId(currentUser.getId()).orElse(null);
        }

        return toDto(drive, studentProfile);
    }

    @Transactional(readOnly = true)
    public List<DriveResponseDto> getDrivesByCompany(Long companyId) {
        List<PlacementDrive> drives = driveRepository.findByCompanyId(companyId);
        return drives.stream().map(d -> toDto(d, null)).collect(Collectors.toList());
    }

    @Transactional
    public PlacementDrive createDrive(UserPrincipal currentUser, CreateDriveRequest req) {
        Company company = null;
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        if (currentUser.getRole() == Role.RECRUITER) {
            RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUser(user)
                    .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));
            company = recruiterProfile.getCompany();
            if (company == null) {
                throw new BadRequestException("Recruiter is not associated with any company");
            }
        } else if (req.getCompanyId() != null) {
            company = companyRepository.findById(req.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", "id", req.getCompanyId()));
        } else {
            throw new BadRequestException("Company ID is required to create a drive");
        }

        PlacementDrive drive = PlacementDrive.builder()
                .company(company)
                .title(req.getTitle().trim())
                .description(req.getDescription())
                .jobRole(req.getJobRole() != null ? req.getJobRole() : req.getTitle())
                .jobLocation(req.getJobLocation() != null ? req.getJobLocation() : "Remote / Hybrid")
                .jobType(req.getJobType() != null ? req.getJobType() : "Full-time")
                .packageLpa(req.getPackageLpa() != null ? req.getPackageLpa() : 10.0)
                .minCgpa(req.getMinCgpa() != null ? req.getMinCgpa() : 6.0)
                .allowedBranches(req.getAllowedBranches() != null ? req.getAllowedBranches() : "CSE,IT,ECE")
                .graduationYear(req.getGraduationYear() != null ? req.getGraduationYear() : 2025)
                .applicationDeadline(req.getApplicationDeadline())
                .status(DriveStatus.APPROVED) // or PENDING_APPROVAL based on policy
                .createdBy(user)
                .build();

        PlacementDrive saved = driveRepository.save(drive);

        auditLogService.log("DRIVE_CREATED", currentUser.getEmail(), "PlacementDrive", saved.getId().toString(),
                "Drive created for " + company.getName() + ": " + saved.getTitle(), null);

        // Notify students about new drive
        List<User> students = userRepository.findByRole(Role.STUDENT);
        for (User student : students) {
            notificationService.createNotification(
                    student,
                    "New Placement Drive: " + company.getName(),
                    company.getName() + " has opened applications for " + saved.getTitle() + " (" + saved.getPackageLpa() + " LPA). Check eligibility now!",
                    Notification.NotificationType.DRIVE_ANNOUNCEMENT,
                    "/student/drives/" + saved.getId()
            );
        }

        return saved;
    }

    @Transactional
    public PlacementDrive updateDrive(Long driveId, CreateDriveRequest req) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        if (req.getTitle() != null) drive.setTitle(req.getTitle().trim());
        if (req.getDescription() != null) drive.setDescription(req.getDescription());
        if (req.getJobRole() != null) drive.setJobRole(req.getJobRole());
        if (req.getJobLocation() != null) drive.setJobLocation(req.getJobLocation());
        if (req.getJobType() != null) drive.setJobType(req.getJobType());
        if (req.getPackageLpa() != null) drive.setPackageLpa(req.getPackageLpa());
        if (req.getMinCgpa() != null) drive.setMinCgpa(req.getMinCgpa());
        if (req.getAllowedBranches() != null) drive.setAllowedBranches(req.getAllowedBranches());
        if (req.getGraduationYear() != null) drive.setGraduationYear(req.getGraduationYear());
        if (req.getApplicationDeadline() != null) drive.setApplicationDeadline(req.getApplicationDeadline());

        return driveRepository.save(drive);
    }

    @Transactional
    public PlacementDrive updateStatus(Long driveId, DriveStatus newStatus) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));
        drive.setStatus(newStatus);
        return driveRepository.save(drive);
    }

    private DriveResponseDto toDto(PlacementDrive drive, StudentProfile studentProfile) {
        EligibilityResult eligibility = null;
        boolean applied = false;
        Long appId = null;
        com.campusx.application.ApplicationStatus appStatus = null;

        if (studentProfile != null) {
            eligibility = eligibilityEngine.checkEligibility(studentProfile, drive);
            Optional<Application> existingApp = applicationRepository.findByPlacementDriveIdAndStudentProfileId(drive.getId(), studentProfile.getId());
            if (existingApp.isPresent()) {
                applied = true;
                appId = existingApp.get().getId();
                appStatus = existingApp.get().getStatus();
            }
        }

        int applicantCount = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(drive.getId()).size();

        return DriveResponseDto.builder()
                .id(drive.getId())
                .title(drive.getTitle())
                .description(drive.getDescription())
                .jobRole(drive.getJobRole())
                .jobLocation(drive.getJobLocation())
                .jobType(drive.getJobType())
                .packageLpa(drive.getPackageLpa())
                .minCgpa(drive.getMinCgpa())
                .allowedBranches(drive.getAllowedBranches())
                .graduationYear(drive.getGraduationYear())
                .applicationDeadline(drive.getApplicationDeadline())
                .status(drive.getStatus())
                .company(drive.getCompany())
                .createdAt(drive.getCreatedAt())
                .totalApplicants(applicantCount)
                .eligibility(eligibility)
                .applied(applied)
                .applicationId(appId)
                .applicationStatus(appStatus)
                .build();
    }
}
