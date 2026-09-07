package com.campusx.placement;

import com.campusx.common.ApiResponse;
import com.campusx.placement.DriveDtos.CreateDriveRequest;
import com.campusx.placement.DriveDtos.DriveResponseDto;
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
public class PlacementDriveController {

    private final PlacementDriveService placementDriveService;

    @GetMapping("/drives")
    public ResponseEntity<ApiResponse<List<DriveResponseDto>>> getAllDrives(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<DriveResponseDto> drives = placementDriveService.getAllDrives(currentUser);
        return ResponseEntity.ok(ApiResponse.success(drives));
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<ApiResponse<DriveResponseDto>> getDriveById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DriveResponseDto drive = placementDriveService.getDriveById(id, currentUser);
        return ResponseEntity.ok(ApiResponse.success(drive));
    }

    @PostMapping("/recruiter/drives")
    public ResponseEntity<ApiResponse<PlacementDrive>> createDrive(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateDriveRequest request) {
        PlacementDrive drive = placementDriveService.createDrive(currentUser, request);
        return new ResponseEntity<>(ApiResponse.success("Placement drive created successfully", drive), HttpStatus.CREATED);
    }

    @PutMapping("/recruiter/drives/{id}")
    public ResponseEntity<ApiResponse<PlacementDrive>> updateDrive(
            @PathVariable Long id,
            @Valid @RequestBody CreateDriveRequest request) {
        PlacementDrive drive = placementDriveService.updateDrive(id, request);
        return ResponseEntity.ok(ApiResponse.success("Placement drive updated", drive));
    }

    @PatchMapping("/officer/drives/{id}/status")
    public ResponseEntity<ApiResponse<PlacementDrive>> updateDriveStatus(
            @PathVariable Long id,
            @RequestParam DriveStatus status) {
        PlacementDrive drive = placementDriveService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Drive status updated to " + status, drive));
    }
}
