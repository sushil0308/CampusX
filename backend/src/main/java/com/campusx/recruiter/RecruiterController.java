package com.campusx.recruiter;

import com.campusx.application.ApplicationRepository;
import com.campusx.application.ApplicationStatus;
import com.campusx.common.ApiResponse;
import com.campusx.common.BadRequestException;
import com.campusx.company.Company;
import com.campusx.company.CompanyRepository;
import com.campusx.interview.InterviewRepository;
import com.campusx.placement.DriveDtos.DriveResponseDto;
import com.campusx.placement.PlacementDriveRepository;
import com.campusx.placement.PlacementDriveService;
import com.campusx.recruiter.RecruiterDtos.RecruiterDashboardStats;
import com.campusx.recruiter.RecruiterDtos.UpdateCompanyRequest;
import com.campusx.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final PlacementDriveService placementDriveService;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<RecruiterDashboardStats>> getDashboardStats(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            return ResponseEntity.ok(ApiResponse.success(RecruiterDashboardStats.builder()
                    .companyName("Not Linked")
                    .activeDrivesCount(0)
                    .totalApplicantsCount(0)
                    .shortlistedCandidatesCount(0)
                    .scheduledInterviewsCount(0)
                    .build()));
        }

        long activeDrives = driveRepository.findByCompanyId(company.getId()).size();
        long totalApplicants = applicationRepository.countByCompanyId(company.getId());
        long shortlisted = applicationRepository.countByCompanyIdAndStatus(company.getId(), ApplicationStatus.SHORTLISTED);
        long interviews = interviewRepository.findByCompanyId(company.getId()).size();

        RecruiterDashboardStats stats = RecruiterDashboardStats.builder()
                .companyName(company.getName())
                .companyLogo(company.getLogoUrl())
                .activeDrivesCount(activeDrives)
                .totalApplicantsCount(totalApplicants)
                .shortlistedCandidatesCount(shortlisted)
                .scheduledInterviewsCount(interviews)
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<RecruiterProfile>> getProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));
        return ResponseEntity.ok(ApiResponse.success(recruiter));
    }

    @PutMapping("/company")
    public ResponseEntity<ApiResponse<Company>> updateCompany(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateCompanyRequest request) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        Company company = recruiter.getCompany();
        if (company == null) {
            company = new Company();
        }

        if (request.getName() != null) company.setName(request.getName().trim());
        if (request.getDescription() != null) company.setDescription(request.getDescription());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite().trim());
        if (request.getLocation() != null) company.setLocation(request.getLocation().trim());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry().trim());
        if (request.getLogoUrl() != null) company.setLogoUrl(request.getLogoUrl().trim());
        if (request.getContactEmail() != null) company.setContactEmail(request.getContactEmail().trim());
        if (request.getContactPhone() != null) company.setContactPhone(request.getContactPhone().trim());

        Company saved = companyRepository.save(company);
        recruiter.setCompany(saved);
        recruiterProfileRepository.save(recruiter);

        return ResponseEntity.ok(ApiResponse.success("Company profile updated successfully", saved));
    }

    @GetMapping("/my-drives")
    public ResponseEntity<ApiResponse<List<DriveResponseDto>>> getMyDrives(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));

        if (recruiter.getCompany() == null) {
            return ResponseEntity.ok(ApiResponse.success(List.of()));
        }

        List<DriveResponseDto> drives = placementDriveService.getDrivesByCompany(recruiter.getCompany().getId());
        return ResponseEntity.ok(ApiResponse.success(drives));
    }
}
