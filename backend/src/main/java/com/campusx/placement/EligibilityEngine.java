package com.campusx.placement;

import com.campusx.student.StudentProfile;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class EligibilityEngine {

    public EligibilityResult checkEligibility(StudentProfile student, PlacementDrive drive) {
        List<String> reasons = new ArrayList<>();
        boolean cgpaOk = true;
        boolean branchOk = true;
        boolean gradYearOk = true;
        boolean deadlineOk = true;

        // 1. Check CGPA
        Double studentCgpa = student.getCgpa() != null ? student.getCgpa() : 0.0;
        Double requiredCgpa = drive.getMinCgpa() != null ? drive.getMinCgpa() : 0.0;
        if (studentCgpa < requiredCgpa) {
            cgpaOk = false;
            reasons.add(String.format("CGPA %.2f is below the minimum required %.2f", studentCgpa, requiredCgpa));
        }

        // 2. Check Branch
        String studentBranch = student.getDepartment() != null ? student.getDepartment().trim().toUpperCase() : "";
        String allowedBranchesStr = drive.getAllowedBranches() != null ? drive.getAllowedBranches().trim() : "";
        if (!allowedBranchesStr.equalsIgnoreCase("ALL") && !allowedBranchesStr.isEmpty()) {
            List<String> allowedList = Arrays.stream(allowedBranchesStr.split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .toList();
            if (!allowedList.contains(studentBranch)) {
                branchOk = false;
                reasons.add(String.format("Branch '%s' is not in allowed branches (%s)", studentBranch, allowedBranchesStr));
            }
        }

        // 3. Check Graduation Year
        Integer studentGradYear = student.getGraduationYear();
        Integer requiredGradYear = drive.getGraduationYear();
        if (requiredGradYear != null && studentGradYear != null && !studentGradYear.equals(requiredGradYear)) {
            gradYearOk = false;
            reasons.add(String.format("Graduation year %d does not match required batch of %d", studentGradYear, requiredGradYear));
        }

        // 4. Check Deadline
        if (drive.getApplicationDeadline() != null && drive.getApplicationDeadline().isBefore(LocalDate.now())) {
            deadlineOk = false;
            reasons.add("Application deadline has passed (" + drive.getApplicationDeadline() + ")");
        }

        // 5. Check Drive Status
        if (drive.getStatus() != DriveStatus.ACTIVE && drive.getStatus() != DriveStatus.APPROVED) {
            reasons.add("Placement drive is not currently open for applications");
        }

        boolean overallEligible = cgpaOk && branchOk && gradYearOk && deadlineOk &&
                (drive.getStatus() == DriveStatus.ACTIVE || drive.getStatus() == DriveStatus.APPROVED);

        return EligibilityResult.builder()
                .eligible(overallEligible)
                .reasons(reasons)
                .cgpaEligible(cgpaOk)
                .branchEligible(branchOk)
                .graduationYearEligible(gradYearOk)
                .deadlineValid(deadlineOk)
                .studentCgpa(studentCgpa)
                .requiredCgpa(requiredCgpa)
                .studentBranch(studentBranch)
                .allowedBranches(allowedBranchesStr)
                .studentGradYear(studentGradYear)
                .requiredGradYear(requiredGradYear)
                .build();
    }
}
