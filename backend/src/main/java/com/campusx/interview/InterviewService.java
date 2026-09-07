package com.campusx.interview;

import com.campusx.admin.AuditLogService;
import com.campusx.application.Application;
import com.campusx.application.ApplicationRepository;
import com.campusx.application.ApplicationStatus;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.interview.InterviewDtos.*;
import com.campusx.notification.Notification;
import com.campusx.notification.NotificationService;
import com.campusx.recruiter.RecruiterProfile;
import com.campusx.recruiter.RecruiterProfileRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.student.StudentProfile;
import com.campusx.student.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");

    @Transactional
    public Interview scheduleInterview(UserPrincipal currentUser, ScheduleInterviewRequest req) {
        Application application = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", req.getApplicationId()));

        Interview interview = Interview.builder()
                .application(application)
                .roundName(req.getRoundName().trim())
                .interviewType(req.getInterviewType() != null ? req.getInterviewType() : Interview.InterviewType.ONLINE)
                .scheduledAt(req.getScheduledAt())
                .durationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 45)
                .meetingLink(req.getMeetingLink() != null ? req.getMeetingLink().trim() : "https://meet.google.com/xyz-demo-link")
                .location(req.getLocation())
                .interviewerName(req.getInterviewerName())
                .status(Interview.InterviewStatus.SCHEDULED)
                .build();

        Interview saved = interviewRepository.save(interview);

        // Update application status
        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        // Notify student
        String companyName = application.getPlacementDrive().getCompany().getName();
        String formattedTime = req.getScheduledAt().format(FORMATTER);
        String notifMsg = String.format("You have an interview (%s) with %s scheduled for %s. Meeting link: %s",
                req.getRoundName(), companyName, formattedTime, interview.getMeetingLink());

        notificationService.createNotification(
                application.getStudentProfile().getUser(),
                "Interview Scheduled: " + companyName,
                notifMsg,
                Notification.NotificationType.INTERVIEW_ALERT,
                "/student/interviews"
        );

        auditLogService.log("INTERVIEW_SCHEDULED", currentUser.getEmail(), "Interview", saved.getId().toString(),
                String.format("Scheduled %s for student %s with %s", req.getRoundName(),
                        application.getStudentProfile().getUser().getFullName(), companyName), null);

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Interview> getStudentInterviews(UserPrincipal currentUser) {
        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));
        return interviewRepository.findByStudentProfileId(student.getId());
    }

    @Transactional(readOnly = true)
    public List<Interview> getCompanyInterviews(UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));
        if (recruiter.getCompany() == null) return List.of();
        return interviewRepository.findByCompanyId(recruiter.getCompany().getId());
    }

    @Transactional
    public Interview updateInterview(Long interviewId, UpdateInterviewRequest req) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview", "id", interviewId));

        if (req.getStatus() != null) interview.setStatus(req.getStatus());
        if (req.getFeedback() != null) interview.setFeedback(req.getFeedback());

        return interviewRepository.save(interview);
    }
}
