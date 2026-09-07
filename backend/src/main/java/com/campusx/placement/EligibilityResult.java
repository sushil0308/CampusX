package com.campusx.placement;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityResult {
    private boolean eligible;
    @Builder.Default
    private List<String> reasons = new ArrayList<>();
    private boolean cgpaEligible;
    private boolean branchEligible;
    private boolean graduationYearEligible;
    private boolean deadlineValid;
    private Double studentCgpa;
    private Double requiredCgpa;
    private String studentBranch;
    private String allowedBranches;
    private Integer studentGradYear;
    private Integer requiredGradYear;
}
