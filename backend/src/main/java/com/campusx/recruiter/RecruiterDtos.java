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
import com.campusx.security.UserPrincipal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public class RecruiterDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecruiterDashboardStats {
        private String companyName;
        private String companyLogo;
        private long activeDrivesCount;
        private long totalApplicantsCount;
        private long shortlistedCandidatesCount;
        private long scheduledInterviewsCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCompanyRequest {
        private String name;
        private String description;
        private String website;
        private String location;
        private String industry;
        private String logoUrl;
        private String contactEmail;
        private String contactPhone;
    }
}
