package com.campusx.auth;

import com.campusx.admin.AuditLogService;
import com.campusx.auth.dto.AuthResponse;
import com.campusx.auth.dto.LoginRequest;
import com.campusx.auth.dto.RegisterRequest;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.company.Company;
import com.campusx.company.CompanyRepository;
import com.campusx.recruiter.RecruiterProfile;
import com.campusx.recruiter.RecruiterProfileRepository;
import com.campusx.security.JwtTokenProvider;
import com.campusx.security.UserPrincipal;
import com.campusx.student.StudentProfile;
import com.campusx.student.StudentProfileRepository;
import com.campusx.user.Role;
import com.campusx.user.User;
import com.campusx.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuditLogService auditLogService;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        if (!user.isActive()) {
            throw new BadRequestException("This account has been deactivated. Please contact the administrator.");
        }

        String token = tokenProvider.generateToken(authentication);

        Long profileId = null;
        String companyName = null;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile studentProfile = studentProfileRepository.findByUser(user).orElse(null);
            if (studentProfile != null) {
                profileId = studentProfile.getId();
            }
        } else if (user.getRole() == Role.RECRUITER) {
            RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUser(user).orElse(null);
            if (recruiterProfile != null) {
                profileId = recruiterProfile.getId();
                if (recruiterProfile.getCompany() != null) {
                    companyName = recruiterProfile.getCompany().getName();
                }
            }
        }

        auditLogService.log("USER_LOGIN", user.getEmail(), "User", user.getId().toString(), "User logged in successfully", null);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profileId(profileId)
                .companyName(companyName)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new BadRequestException("Email is already registered: " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .phone(request.getPhone())
                .active(true)
                .build();

        user = userRepository.save(user);

        Long profileId = null;
        String companyName = null;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile profile = StudentProfile.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber() != null ? request.getRollNumber().trim() : "STU" + user.getId())
                    .department(request.getDepartment() != null ? request.getDepartment().trim() : "Computer Science")
                    .cgpa(request.getCgpa() != null ? request.getCgpa() : 7.5)
                    .graduationYear(request.getGraduationYear() != null ? request.getGraduationYear() : 2025)
                    .profileCompletionPercentage(30)
                    .build();
            profile = studentProfileRepository.save(profile);
            profileId = profile.getId();
        } else if (user.getRole() == Role.RECRUITER) {
            Company company = null;
            if (request.getCompanyName() != null && !request.getCompanyName().trim().isEmpty()) {
                companyName = request.getCompanyName().trim();
                final String compName = companyName;
                company = companyRepository.findByNameIgnoreCase(compName)
                        .orElseGet(() -> companyRepository.save(Company.builder()
                                .name(compName)
                                .verified(false) // Pending officer review
                                .build()));
            }

            RecruiterProfile recruiterProfile = RecruiterProfile.builder()
                    .user(user)
                    .company(company)
                    .designation(request.getDesignation() != null ? request.getDesignation().trim() : "HR Specialist")
                    .approved(true)
                    .build();
            recruiterProfile = recruiterProfileRepository.save(recruiterProfile);
            profileId = recruiterProfile.getId();
        }

        String token = tokenProvider.generateTokenFromUser(user.getId(), user.getEmail(), user.getRole().name());

        auditLogService.log("USER_REGISTER", user.getEmail(), "User", user.getId().toString(), "New " + user.getRole() + " registered", null);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profileId(profileId)
                .companyName(companyName)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse getMe(UserPrincipal currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUser.getId()));

        Long profileId = null;
        String companyName = null;

        if (user.getRole() == Role.STUDENT) {
            StudentProfile studentProfile = studentProfileRepository.findByUser(user).orElse(null);
            if (studentProfile != null) {
                profileId = studentProfile.getId();
            }
        } else if (user.getRole() == Role.RECRUITER) {
            RecruiterProfile recruiterProfile = recruiterProfileRepository.findByUser(user).orElse(null);
            if (recruiterProfile != null) {
                profileId = recruiterProfile.getId();
                if (recruiterProfile.getCompany() != null) {
                    companyName = recruiterProfile.getCompany().getName();
                }
            }
        }

        return AuthResponse.builder()
                .token(null)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .profileId(profileId)
                .companyName(companyName)
                .build();
    }
}
