package com.campusx.company;

import com.campusx.common.ApiResponse;
import com.campusx.common.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository companyRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Company>>> getAllCompanies() {
        return ResponseEntity.ok(ApiResponse.success(companyRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Company>> getCompanyById(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", id));
        return ResponseEntity.ok(ApiResponse.success(company));
    }
}
