package com.campusx.application;

import com.campusx.application.ApplicationDtos.*;
import com.campusx.common.ApiResponse;
import com.campusx.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/student/applications")
    public ResponseEntity<ApiResponse<Application>> apply(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ApplyRequest request) {
        Application application = applicationService.apply(currentUser, request);
        return new ResponseEntity<>(ApiResponse.success("Application submitted successfully", application), HttpStatus.CREATED);
    }

    @PatchMapping("/student/applications/{id}/withdraw")
    public ResponseEntity<ApiResponse<Application>> withdraw(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Application application = applicationService.withdraw(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn", application));
    }

    @GetMapping("/student/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponseDto> applications = applicationService.getMyApplications(currentUser);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/recruiter/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getCompanyApplicants(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponseDto> applicants = applicationService.getAllCompanyApplicants(currentUser);
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @GetMapping("/recruiter/drives/{driveId}/applicants")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getDriveApplicants(
            @PathVariable Long driveId,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<ApplicationResponseDto> applicants = applicationService.getApplicantsForDrive(driveId, currentUser);
        return ResponseEntity.ok(ApiResponse.success(applicants));
    }

    @PatchMapping("/recruiter/applications/{id}/status")
    public ResponseEntity<ApiResponse<Application>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Application updated = applicationService.updateApplicationStatus(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Application status updated to " + request.getStatus(), updated));
    }
}
