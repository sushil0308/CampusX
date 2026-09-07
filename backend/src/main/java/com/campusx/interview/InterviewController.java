package com.campusx.interview;

import com.campusx.common.ApiResponse;
import com.campusx.interview.InterviewDtos.ScheduleInterviewRequest;
import com.campusx.interview.InterviewDtos.UpdateInterviewRequest;
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
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/recruiter/interviews")
    public ResponseEntity<ApiResponse<Interview>> scheduleInterview(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ScheduleInterviewRequest request) {
        Interview interview = interviewService.scheduleInterview(currentUser, request);
        return new ResponseEntity<>(ApiResponse.success("Interview scheduled successfully", interview), HttpStatus.CREATED);
    }

    @GetMapping("/student/interviews")
    public ResponseEntity<ApiResponse<List<Interview>>> getStudentInterviews(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Interview> interviews = interviewService.getStudentInterviews(currentUser);
        return ResponseEntity.ok(ApiResponse.success(interviews));
    }

    @GetMapping("/recruiter/interviews")
    public ResponseEntity<ApiResponse<List<Interview>>> getRecruiterInterviews(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Interview> interviews = interviewService.getCompanyInterviews(currentUser);
        return ResponseEntity.ok(ApiResponse.success(interviews));
    }

    @PatchMapping("/interviews/{id}")
    public ResponseEntity<ApiResponse<Interview>> updateInterview(
            @PathVariable Long id,
            @RequestBody UpdateInterviewRequest request) {
        Interview updated = interviewService.updateInterview(id, request);
        return ResponseEntity.ok(ApiResponse.success("Interview updated", updated));
    }
}
