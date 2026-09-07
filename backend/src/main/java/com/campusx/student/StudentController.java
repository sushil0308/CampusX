package com.campusx.student;

import com.campusx.common.ApiResponse;
import com.campusx.security.UserPrincipal;
import com.campusx.student.dto.StudentDtos.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats(@AuthenticationPrincipal UserPrincipal currentUser) {
        DashboardStats stats = studentService.getDashboardStats(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfile>> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfile profile = studentService.getProfileByUserId(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfile>> updateProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ProfileUpdateRequest request) {
        StudentProfile profile = studentService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/full-profile")
    public ResponseEntity<ApiResponse<FullProfileResponse>> getFullProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        StudentProfile profile = studentService.getProfileByUserId(currentUser.getId());
        FullProfileResponse fullProfile = studentService.getFullProfile(profile.getId());
        return ResponseEntity.ok(ApiResponse.success(fullProfile));
    }

    @GetMapping("/profiles/{id}")
    public ResponseEntity<ApiResponse<FullProfileResponse>> getStudentProfileById(@PathVariable Long id) {
        FullProfileResponse fullProfile = studentService.getFullProfile(id);
        return ResponseEntity.ok(ApiResponse.success(fullProfile));
    }

    @PostMapping("/education")
    public ResponseEntity<ApiResponse<Education>> addEducation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody EducationRequest request) {
        Education edu = studentService.addEducation(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Education added", edu), HttpStatus.CREATED);
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEducation(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        studentService.deleteEducation(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Education deleted", null));
    }

    @PostMapping("/skills")
    public ResponseEntity<ApiResponse<StudentSkill>> addSkill(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody AddSkillRequest request) {
        StudentSkill skill = studentService.addSkill(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Skill added", skill), HttpStatus.CREATED);
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSkill(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        studentService.deleteSkill(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Skill removed", null));
    }

    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<Project>> addProject(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ProjectRequest request) {
        Project project = studentService.addProject(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Project added", project), HttpStatus.CREATED);
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        studentService.deleteProject(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Project deleted", null));
    }

    @PostMapping("/internships")
    public ResponseEntity<ApiResponse<Internship>> addInternship(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody InternshipRequest request) {
        Internship internship = studentService.addInternship(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Internship added", internship), HttpStatus.CREATED);
    }

    @DeleteMapping("/internships/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInternship(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        studentService.deleteInternship(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Internship deleted", null));
    }

    @PostMapping("/certifications")
    public ResponseEntity<ApiResponse<Certification>> addCertification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody CertificationRequest request) {
        Certification cert = studentService.addCertification(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Certification added", cert), HttpStatus.CREATED);
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCertification(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        studentService.deleteCertification(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Certification deleted", null));
    }

    @PostMapping("/resume")
    public ResponseEntity<ApiResponse<Resume>> uploadResume(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody ResumeUploadRequest request) {
        Resume resume = studentService.uploadResume(currentUser.getId(), request);
        return new ResponseEntity<>(ApiResponse.success("Resume updated", resume), HttpStatus.CREATED);
    }
}
