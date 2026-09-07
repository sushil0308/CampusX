package com.campusx.officer;

import com.campusx.admin.AuditLogService;
import com.campusx.application.Application;
import com.campusx.application.ApplicationRepository;
import com.campusx.common.ApiResponse;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.company.Company;
import com.campusx.company.CompanyRepository;
import com.campusx.offer.Offer;
import com.campusx.offer.OfferRepository;
import com.campusx.officer.OfficerDtos.BranchStat;
import com.campusx.officer.OfficerDtos.CompanyPlacementStat;
import com.campusx.officer.OfficerDtos.OfficerDashboardStats;
import com.campusx.placement.DriveStatus;
import com.campusx.placement.PlacementDriveRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.student.StudentProfile;
import com.campusx.student.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final OfferRepository offerRepository;
    private final AuditLogService auditLogService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OfficerDashboardStats>> getDashboardStats() {
        long totalStudents = studentProfileRepository.count();
        long placedStudents = studentProfileRepository.countByPlaced(true);
        double placementPct = totalStudents > 0 ? ((double) placedStudents / totalStudents) * 100.0 : 0.0;

        long registeredCompanies = companyRepository.count();
        long activeDrives = driveRepository.countByStatus(DriveStatus.APPROVED) + driveRepository.countByStatus(DriveStatus.ACTIVE);
        long totalApplications = applicationRepository.count();

        Double avgPackage = offerRepository.findAveragePackage();
        Double maxPackage = offerRepository.findHighestPackage();

        // Calculate branch-wise statistics
        List<StudentProfile> allStudents = studentProfileRepository.findAll();
        Map<String, List<StudentProfile>> byDept = allStudents.stream()
                .collect(Collectors.groupingBy(s -> s.getDepartment() != null ? s.getDepartment() : "General"));

        List<BranchStat> branchStats = new ArrayList<>();
        byDept.forEach((dept, list) -> {
            long placed = list.stream().filter(StudentProfile::isPlaced).count();
            double pct = list.size() > 0 ? ((double) placed / list.size()) * 100.0 : 0.0;
            branchStats.add(BranchStat.builder()
                    .branch(dept)
                    .totalStudents(list.size())
                    .placedStudents(placed)
                    .placementPercentage(Math.round(pct * 10.0) / 10.0)
                    .build());
        });

        // Top recruiters
        List<Offer> allOffers = offerRepository.findAll();
        Map<Company, Long> offersByCompany = allOffers.stream()
                .collect(Collectors.groupingBy(Offer::getCompany, Collectors.counting()));

        List<CompanyPlacementStat> topRecruiters = offersByCompany.entrySet().stream()
                .map(entry -> CompanyPlacementStat.builder()
                        .companyName(entry.getKey().getName())
                        .packageLpa(allOffers.stream()
                                .filter(o -> o.getCompany().getId().equals(entry.getKey().getId()))
                                .mapToDouble(Offer::getPackageLpa)
                                .max().orElse(0.0))
                        .offersCount(entry.getValue())
                        .build())
                .sorted((a, b) -> Long.compare(b.getOffersCount(), a.getOffersCount()))
                .limit(5)
                .collect(Collectors.toList());

        OfficerDashboardStats stats = OfficerDashboardStats.builder()
                .totalStudents(totalStudents)
                .placedStudents(placedStudents)
                .placementPercentage(Math.round(placementPct * 10.0) / 10.0)
                .registeredCompanies(registeredCompanies)
                .activeDrives(activeDrives)
                .totalApplications(totalApplications)
                .averagePackageLpa(avgPackage != null ? Math.round(avgPackage * 10.0) / 10.0 : 0.0)
                .highestPackageLpa(maxPackage != null ? maxPackage : 0.0)
                .branchWiseStats(branchStats)
                .topRecruiters(topRecruiters)
                .build();

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentProfile>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(studentProfileRepository.findAll()));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<List<Company>>> getAllCompanies() {
        return ResponseEntity.ok(ApiResponse.success(companyRepository.findAll()));
    }

    @PatchMapping("/companies/{id}/verify")
    public ResponseEntity<ApiResponse<Company>> toggleCompanyVerification(
            @PathVariable Long id,
            @RequestParam boolean verified,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        company.setVerified(verified);
        Company saved = companyRepository.save(company);

        auditLogService.log("COMPANY_VERIFICATION_TOGGLED", currentUser.getEmail(), "Company", id.toString(),
                "Company " + company.getName() + " verified status set to " + verified, null);

        return ResponseEntity.ok(ApiResponse.success("Company verification updated", saved));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<Application>>> getAllApplications() {
        return ResponseEntity.ok(ApiResponse.success(applicationRepository.findAll()));
    }
}
