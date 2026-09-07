package com.campusx.application;

import com.campusx.admin.AuditLogService;
import com.campusx.application.ApplicationDtos.*;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.notification.Notification;
import com.campusx.notification.NotificationService;
import com.campusx.placement.EligibilityEngine;
import com.campusx.placement.EligibilityResult;
import com.campusx.placement.PlacementDrive;
import com.campusx.placement.PlacementDriveRepository;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PlacementDriveRepository driveRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final UserRepository userRepository;
    private final EligibilityEngine eligibilityEngine;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public Application apply(UserPrincipal currentUser, ApplyRequest req) {
        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found. Please complete your profile first."));

        PlacementDrive drive = driveRepository.findById(req.getDriveId())
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", req.getDriveId()));

        // Check if already applied
        if (applicationRepository.existsByPlacementDriveIdAndStudentProfileId(drive.getId(), student.getId())) {
            throw new BadRequestException("You have already submitted an application for this placement drive.");
        }

        // Check eligibility rigorously
        EligibilityResult eligibility = eligibilityEngine.checkEligibility(student, drive);
        if (!eligibility.isEligible()) {
            String reasons = String.join("; ", eligibility.getReasons());
            throw new BadRequestException("You do not meet the eligibility criteria: " + reasons);
        }

        Application application = Application.builder()
                .placementDrive(drive)
                .studentProfile(student)
                .status(ApplicationStatus.APPLIED)
                .coverNote(req.getCoverNote() != null ? req.getCoverNote().trim() : "")
                .build();

        Application saved = applicationRepository.save(application);

        // Notify student
        notificationService.createNotification(
                student.getUser(),
                "Application Submitted Successfully",
                "Your application for " + drive.getTitle() + " at " + drive.getCompany().getName() + " has been received.",
                Notification.NotificationType.APPLICATION_UPDATE,
                "/student/applications"
        );

        // Audit log
        auditLogService.log("APPLICATION_SUBMITTED", currentUser.getEmail(), "Application", saved.getId().toString(),
                "Applied to " + drive.getTitle() + " at " + drive.getCompany().getName(), null);

        return saved;
    }

    @Transactional
    public Application withdraw(Long applicationId, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        if (!application.getStudentProfile().getId().equals(student.getId())) {
            throw new BadRequestException("You can only withdraw your own applications");
        }

        application.setStatus(ApplicationStatus.WITHDRAWN);
        Application saved = applicationRepository.save(application);

        auditLogService.log("APPLICATION_WITHDRAWN", currentUser.getEmail(), "Application", saved.getId().toString(),
                "Withdrew application for " + application.getPlacementDrive().getTitle(), null);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getMyApplications(UserPrincipal currentUser) {
        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        List<Application> list = applicationRepository.findByStudentProfileIdOrderByAppliedAtDesc(student.getId());
        return list.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getApplicantsForDrive(Long driveId, UserPrincipal currentUser) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));

        if (currentUser.getRole() == Role.RECRUITER) {
            RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));
            if (recruiter.getCompany() == null || !recruiter.getCompany().getId().equals(drive.getCompany().getId())) {
                throw new BadRequestException("You can only view applicants for your company's drives");
            }
        }

        List<Application> list = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(driveId);
        return list.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getAllCompanyApplicants(UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        if (recruiter.getCompany() == null) {
            return List.of();
        }

        List<Application> list = applicationRepository.findByCompanyId(recruiter.getCompany().getId());
        return list.stream().map(this::toResponseDto).collect(Collectors.toList());
    }

    @Transactional
    public Application updateApplicationStatus(Long applicationId, StatusUpdateRequest req, UserPrincipal currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

        ApplicationStatus oldStatus = application.getStatus();
        application.setStatus(req.getStatus());
        Application saved = applicationRepository.save(application);

        // Notify student about status change
        String companyName = application.getPlacementDrive().getCompany().getName();
        String roleTitle = application.getPlacementDrive().getTitle();
        String message = String.format("Your application status for %s at %s was updated to %s.", roleTitle, companyName, req.getStatus());
        if (req.getFeedback() != null && !req.getFeedback().isBlank()) {
            message += " Note: " + req.getFeedback();
        }

        notificationService.createNotification(
                application.getStudentProfile().getUser(),
                "Application Status Update: " + req.getStatus(),
                message,
                Notification.NotificationType.APPLICATION_UPDATE,
                "/student/applications"
        );

        auditLogService.log("APPLICATION_STATUS_UPDATED", currentUser.getEmail(), "Application", saved.getId().toString(),
                String.format("Status changed from %s to %s for %s", oldStatus, req.getStatus(), application.getStudentProfile().getUser().getFullName()), null);

        return saved;
    }

    private ApplicationResponseDto toResponseDto(Application app) {
        User studentUser = app.getStudentProfile().getUser();
        return ApplicationResponseDto.builder()
                .id(app.getId())
                .placementDrive(app.getPlacementDrive())
                .studentProfile(app.getStudentProfile())
                .studentFullName(studentUser.getFullName())
                .studentEmail(studentUser.getEmail())
                .studentPhone(studentUser.getPhone())
                .status(app.getStatus())
                .coverNote(app.getCoverNote())
                .appliedAt(app.getAppliedAt())
                .updatedAt(app.getUpdatedAt())
                .build();
    }
}
