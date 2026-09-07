package com.campusx.student;

import com.campusx.application.ApplicationRepository;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.interview.InterviewRepository;
import com.campusx.offer.OfferRepository;
import com.campusx.placement.DriveStatus;
import com.campusx.placement.EligibilityEngine;
import com.campusx.placement.PlacementDrive;
import com.campusx.placement.PlacementDriveRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.student.dto.StudentDtos.*;
import com.campusx.user.User;
import com.campusx.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final EducationRepository educationRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final ProjectRepository projectRepository;
    private final InternshipRepository internshipRepository;
    private final CertificationRepository certificationRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final EligibilityEngine eligibilityEngine;

    @Transactional(readOnly = true)
    public StudentProfile getProfileByUserId(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user id: " + userId));
    }

    @Transactional(readOnly = true)
    public FullProfileResponse getFullProfile(Long profileId) {
        StudentProfile profile = studentProfileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "id", profileId));
        User user = profile.getUser();

        return FullProfileResponse.builder()
                .profile(profile)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .educations(educationRepository.findByStudentProfileIdOrderByStartYearDesc(profileId))
                .skills(studentSkillRepository.findByStudentProfileId(profileId))
                .projects(projectRepository.findByStudentProfileIdOrderByStartDateDesc(profileId))
                .internships(internshipRepository.findByStudentProfileIdOrderByStartDateDesc(profileId))
                .certifications(certificationRepository.findByStudentProfileIdOrderByIssueDateDesc(profileId))
                .resumes(resumeRepository.findByStudentProfileIdOrderByUploadedAtDesc(profileId))
                .build();
    }

    @Transactional
    public StudentProfile updateProfile(Long userId, ProfileUpdateRequest req) {
        StudentProfile profile = getProfileByUserId(userId);

        if (req.getRollNumber() != null) profile.setRollNumber(req.getRollNumber().trim());
        if (req.getDepartment() != null) profile.setDepartment(req.getDepartment().trim());
        if (req.getCgpa() != null) profile.setCgpa(req.getCgpa());
        if (req.getGraduationYear() != null) profile.setGraduationYear(req.getGraduationYear());
        if (req.getBio() != null) profile.setBio(req.getBio().trim());
        if (req.getGithubUrl() != null) profile.setGithubUrl(req.getGithubUrl().trim());
        if (req.getLinkedinUrl() != null) profile.setLinkedinUrl(req.getLinkedinUrl().trim());
        if (req.getPortfolioUrl() != null) profile.setPortfolioUrl(req.getPortfolioUrl().trim());
        if (req.getResumeUrl() != null) profile.setResumeUrl(req.getResumeUrl().trim());

        profile.setProfileCompletionPercentage(calculateCompletionPercentage(profile.getId(), profile));
        return studentProfileRepository.save(profile);
    }

    @Transactional
    public Education addEducation(Long userId, EducationRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Education education = Education.builder()
                .studentProfile(profile)
                .degree(req.getDegree())
                .institution(req.getInstitution())
                .boardOrUniversity(req.getBoardOrUniversity())
                .startYear(req.getStartYear())
                .endYear(req.getEndYear())
                .score(req.getScore())
                .completed(req.isCompleted())
                .build();
        Education saved = educationRepository.save(education);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional
    public void deleteEducation(Long userId, Long educationId) {
        StudentProfile profile = getProfileByUserId(userId);
        Education edu = educationRepository.findById(educationId)
                .orElseThrow(() -> new ResourceNotFoundException("Education", "id", educationId));
        if (!edu.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("Unauthorized access to education record");
        }
        educationRepository.delete(edu);
        updateProfileCompletion(profile);
    }

    @Transactional
    public StudentSkill addSkill(Long userId, AddSkillRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Skill skill = skillRepository.findByNameIgnoreCase(req.getSkillName().trim())
                .orElseGet(() -> skillRepository.save(Skill.builder()
                        .name(req.getSkillName().trim())
                        .category(req.getCategory() != null ? req.getCategory() : "General")
                        .build()));

        if (studentSkillRepository.existsByStudentProfileIdAndSkillId(profile.getId(), skill.getId())) {
            throw new BadRequestException("Skill already added to profile");
        }

        StudentSkill studentSkill = StudentSkill.builder()
                .studentProfile(profile)
                .skill(skill)
                .proficiencyLevel(req.getProficiencyLevel() != null ? req.getProficiencyLevel() : StudentSkill.ProficiencyLevel.INTERMEDIATE)
                .build();

        StudentSkill saved = studentSkillRepository.save(studentSkill);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional
    public void deleteSkill(Long userId, Long skillId) {
        StudentProfile profile = getProfileByUserId(userId);
        studentSkillRepository.deleteByStudentProfileIdAndSkillId(profile.getId(), skillId);
        updateProfileCompletion(profile);
    }

    @Transactional
    public Project addProject(Long userId, ProjectRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Project project = Project.builder()
                .studentProfile(profile)
                .title(req.getTitle())
                .description(req.getDescription())
                .technologies(req.getTechnologies())
                .githubUrl(req.getGithubUrl())
                .liveUrl(req.getLiveUrl())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
        Project saved = projectRepository.save(project);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        StudentProfile profile = getProfileByUserId(userId);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", projectId));
        if (!project.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("Unauthorized access to project");
        }
        projectRepository.delete(project);
        updateProfileCompletion(profile);
    }

    @Transactional
    public Internship addInternship(Long userId, InternshipRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Internship internship = Internship.builder()
                .studentProfile(profile)
                .companyName(req.getCompanyName())
                .role(req.getRole())
                .description(req.getDescription())
                .location(req.getLocation())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .certificateUrl(req.getCertificateUrl())
                .build();
        Internship saved = internshipRepository.save(internship);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional
    public void deleteInternship(Long userId, Long internshipId) {
        StudentProfile profile = getProfileByUserId(userId);
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship", "id", internshipId));
        if (!internship.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("Unauthorized access to internship");
        }
        internshipRepository.delete(internship);
        updateProfileCompletion(profile);
    }

    @Transactional
    public Certification addCertification(Long userId, CertificationRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Certification cert = Certification.builder()
                .studentProfile(profile)
                .title(req.getTitle())
                .issuingOrganization(req.getIssuingOrganization())
                .issueDate(req.getIssueDate())
                .credentialId(req.getCredentialId())
                .credentialUrl(req.getCredentialUrl())
                .build();
        Certification saved = certificationRepository.save(cert);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional
    public void deleteCertification(Long userId, Long certId) {
        StudentProfile profile = getProfileByUserId(userId);
        Certification cert = certificationRepository.findById(certId)
                .orElseThrow(() -> new ResourceNotFoundException("Certification", "id", certId));
        if (!cert.getStudentProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("Unauthorized access to certification");
        }
        certificationRepository.delete(cert);
        updateProfileCompletion(profile);
    }

    @Transactional
    public Resume uploadResume(Long userId, ResumeUploadRequest req) {
        StudentProfile profile = getProfileByUserId(userId);
        Resume resume = Resume.builder()
                .studentProfile(profile)
                .fileName(req.getFileName())
                .fileUrl(req.getFileUrl())
                .fileType(req.getFileType())
                .fileSize(req.getFileSize())
                .primary(req.isPrimary())
                .build();
        profile.setResumeUrl(req.getFileUrl());
        Resume saved = resumeRepository.save(resume);
        updateProfileCompletion(profile);
        return saved;
    }

    @Transactional(readOnly = true)
    public DashboardStats getDashboardStats(Long userId) {
        StudentProfile profile = getProfileByUserId(userId);

        List<PlacementDrive> activeDrives = driveRepository.findByStatusIn(List.of(DriveStatus.ACTIVE, DriveStatus.APPROVED));
        long eligibleCount = activeDrives.stream()
                .filter(drive -> eligibilityEngine.checkEligibility(profile, drive).isEligible())
                .count();

        long appliedCount = applicationRepository.findByStudentProfileIdOrderByAppliedAtDesc(profile.getId()).size();
        long upcomingInterviews = interviewRepository.findUpcomingByStudentProfileId(profile.getId(), LocalDateTime.now()).size();
        long offersCount = offerRepository.findByStudentProfileIdOrderByCreatedAtDesc(profile.getId()).size();

        return DashboardStats.builder()
                .profileCompletionPercentage(profile.getProfileCompletionPercentage())
                .eligibleDrivesCount(eligibleCount)
                .appliedDrivesCount(appliedCount)
                .upcomingInterviewsCount(upcomingInterviews)
                .offersReceivedCount(offersCount)
                .isPlaced(profile.isPlaced())
                .placedCompany(profile.getPlacedCompany())
                .placedPackageLpa(profile.getPlacedPackageLpa())
                .build();
    }

    private void updateProfileCompletion(StudentProfile profile) {
        profile.setProfileCompletionPercentage(calculateCompletionPercentage(profile.getId(), profile));
        studentProfileRepository.save(profile);
    }

    private int calculateCompletionPercentage(Long profileId, StudentProfile profile) {
        int score = 20; // Base user info
        if (profile.getCgpa() != null && profile.getDepartment() != null && profile.getRollNumber() != null) {
            score += 15;
        }
        if (profile.getBio() != null && !profile.getBio().isBlank()) {
            score += 5;
        }
        if (profile.getResumeUrl() != null && !profile.getResumeUrl().isBlank()) {
            score += 15;
        }
        if (profileId != null) {
            if (!educationRepository.findByStudentProfileIdOrderByStartYearDesc(profileId).isEmpty()) {
                score += 15;
            }
            if (!studentSkillRepository.findByStudentProfileId(profileId).isEmpty()) {
                score += 15;
            }
            if (!projectRepository.findByStudentProfileIdOrderByStartDateDesc(profileId).isEmpty()) {
                score += 10;
            }
            if (!internshipRepository.findByStudentProfileIdOrderByStartDateDesc(profileId).isEmpty() ||
                !certificationRepository.findByStudentProfileIdOrderByIssueDateDesc(profileId).isEmpty()) {
                score += 5;
            }
        }
        return Math.min(score, 100);
    }
}
