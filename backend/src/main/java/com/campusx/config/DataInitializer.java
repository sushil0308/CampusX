package com.campusx.config;

import com.campusx.admin.AuditLog;
import com.campusx.admin.AuditLogRepository;
import com.campusx.application.Application;
import com.campusx.application.ApplicationRepository;
import com.campusx.application.ApplicationStatus;
import com.campusx.company.Company;
import com.campusx.company.CompanyRepository;
import com.campusx.interview.Interview;
import com.campusx.interview.InterviewRepository;
import com.campusx.notification.Notification;
import com.campusx.notification.NotificationRepository;
import com.campusx.offer.Offer;
import com.campusx.offer.OfferRepository;
import com.campusx.placement.DriveStatus;
import com.campusx.placement.PlacementDrive;
import com.campusx.placement.PlacementDriveRepository;
import com.campusx.recruiter.RecruiterProfile;
import com.campusx.recruiter.RecruiterProfileRepository;
import com.campusx.student.*;
import com.campusx.user.Role;
import com.campusx.user.User;
import com.campusx.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SkillRepository skillRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final EducationRepository educationRepository;
    private final ProjectRepository projectRepository;
    private final InternshipRepository internshipRepository;
    private final CertificationRepository certificationRepository;
    private final ResumeRepository resumeRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final OfferRepository offerRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already contains data, skipping initializer.");
            return;
        }

        log.info("Seeding realistic sample data for Campus Placement & Recruitment Platform...");

        // 1. Create Core Skills
        Skill javaSkill = skillRepository.save(Skill.builder().name("Java").category("Programming").build());
        Skill springSkill = skillRepository.save(Skill.builder().name("Spring Boot").category("Backend").build());
        Skill reactSkill = skillRepository.save(Skill.builder().name("React.js").category("Frontend").build());
        Skill postgresSkill = skillRepository.save(Skill.builder().name("PostgreSQL").category("Database").build());
        Skill dockerSkill = skillRepository.save(Skill.builder().name("Docker").category("DevOps").build());
        Skill awsSkill = skillRepository.save(Skill.builder().name("AWS").category("Cloud").build());
        Skill pythonSkill = skillRepository.save(Skill.builder().name("Python").category("Programming").build());
        Skill dsaSkill = skillRepository.save(Skill.builder().name("Data Structures & Algorithms").category("Computer Science").build());
        Skill cppSkill = skillRepository.save(Skill.builder().name("C++").category("Programming").build());
        Skill mlSkill = skillRepository.save(Skill.builder().name("PyTorch & Deep Learning").category("AI / Data Science").build());
        Skill k8sSkill = skillRepository.save(Skill.builder().name("Kubernetes").category("DevOps").build());
        Skill finSkill = skillRepository.save(Skill.builder().name("Quantitative Financial Modeling").category("Finance").build());
        Skill vlsiSkill = skillRepository.save(Skill.builder().name("Verilog & VLSI Design").category("Hardware").build());

        // 2. Create Companies
        Company google = companyRepository.save(Company.builder()
                .name("Google")
                .description("Google LLC is an American multinational corporation focusing on search, cloud computing, software, and AI.")
                .website("https://careers.google.com")
                .location("Bangalore / Hyderabad, India")
                .industry("Technology / Cloud / AI")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg")
                .verified(true)
                .contactEmail("campus-recruitment@google.com")
                .contactPhone("+91-80-67218000")
                .build());

        Company microsoft = companyRepository.save(Company.builder()
                .name("Microsoft")
                .description("Microsoft Corporation develops, manufactures, licenses, supports, and sells computer software and cloud infrastructure.")
                .website("https://careers.microsoft.com")
                .location("Hyderabad / Noida, India")
                .industry("Software / Enterprise Cloud")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg")
                .verified(true)
                .contactEmail("university-hiring@microsoft.com")
                .contactPhone("+91-40-66950000")
                .build());

        Company amazon = companyRepository.save(Company.builder()
                .name("Amazon")
                .description("Amazon is guided by four principles: customer obsession, passion for invention, operational excellence, and long-term thinking.")
                .website("https://www.amazon.jobs")
                .location("Bangalore / Chennai, India")
                .industry("E-commerce / AWS Cloud")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg")
                .verified(true)
                .contactEmail("amazon-campus@amazon.com")
                .contactPhone("+91-80-41350000")
                .build());

        Company nvidia = companyRepository.save(Company.builder()
                .name("NVIDIA")
                .description("NVIDIA is the pioneer of GPU-accelerated computing and world leader in AI processors, Omniverse, and supercomputing systems.")
                .website("https://www.nvidia.com/careers")
                .location("Pune / Bangalore, India")
                .industry("Artificial Intelligence / Semiconductors")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg")
                .verified(true)
                .contactEmail("university@nvidia.com")
                .contactPhone("+91-20-67310000")
                .build());

        Company goldman = companyRepository.save(Company.builder()
                .name("Goldman Sachs")
                .description("Goldman Sachs is a leading global investment banking, securities, and investment management firm.")
                .website("https://www.goldmansachs.com/careers")
                .location("Bangalore / Hyderabad, India")
                .industry("Investment Banking & FinTech")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/6/61/Goldman_Sachs.svg")
                .verified(true)
                .contactEmail("gs-campus@gs.com")
                .contactPhone("+91-80-41277000")
                .build());

        Company adobe = companyRepository.save(Company.builder()
                .name("Adobe Systems")
                .description("Adobe creates revolutionary digital experiences, Creative Cloud creative suites, and enterprise document management systems.")
                .website("https://www.adobe.com/careers")
                .location("Noida / Bangalore, India")
                .industry("Digital Media & Enterprise Software")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Corporate_Logo.png")
                .verified(true)
                .contactEmail("adobe-university@adobe.com")
                .contactPhone("+91-120-2444555")
                .build());

        Company atlassian = companyRepository.save(Company.builder()
                .name("Atlassian")
                .description("Atlassian powers teamwork with enterprise collaboration platforms like Jira, Confluence, Trello, and Bitbucket.")
                .website("https://www.atlassian.com/company/careers")
                .location("Bangalore, India (Remote-Friendly)")
                .industry("Software Collaboration & SRE")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/0/05/Atlassian-Logo.svg")
                .verified(true)
                .contactEmail("talent@atlassian.com")
                .contactPhone("+91-80-68190000")
                .build());

        Company uber = companyRepository.save(Company.builder()
                .name("Uber Technologies")
                .description("Uber develops technology platforms that connect riders and drivers, eaters and restaurants, shippers and carriers.")
                .website("https://www.uber.com/careers")
                .location("Bangalore / Hyderabad, India")
                .industry("Distributed Systems & Mobility")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png")
                .verified(true)
                .contactEmail("university-apac@uber.com")
                .contactPhone("+91-80-49112200")
                .build());

        Company tcs = companyRepository.save(Company.builder()
                .name("Tata Consultancy Services (TCS)")
                .description("TCS is an Indian multinational information technology services and consulting company headquartered in Mumbai.")
                .website("https://www.tcs.com/careers")
                .location("Pan-India Delivery Centers")
                .industry("IT Services & Consulting")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg")
                .verified(true)
                .contactEmail("campus.connect@tcs.com")
                .contactPhone("+91-22-67789999")
                .build());

        // 3. Create Demo Users
        // Admin
        User adminUser = userRepository.save(User.builder()
                .email("admin@campusx.edu")
                .password(passwordEncoder.encode("Admin@123"))
                .role(Role.ADMIN)
                .firstName("Campus")
                .lastName("Administrator")
                .phone("+91-9876500001")
                .active(true)
                .build());

        // Placement Officer
        User officerUser = userRepository.save(User.builder()
                .email("officer@campusx.edu")
                .password(passwordEncoder.encode("Officer@123"))
                .role(Role.PLACEMENT_OFFICER)
                .firstName("Dr. Rajesh")
                .lastName("Nambiar")
                .phone("+91-9876500002")
                .active(true)
                .build());

        // Recruiters
        User googleRecruiterUser = userRepository.save(User.builder()
                .email("recruiter.google@campusx.edu")
                .password(passwordEncoder.encode("Recruiter@123"))
                .role(Role.RECRUITER)
                .firstName("Sarah")
                .lastName("Jenkins")
                .phone("+91-9876500010")
                .active(true)
                .build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(googleRecruiterUser)
                .company(google)
                .designation("University Talent Acquisition Lead")
                .approved(true)
                .build());

        User msRecruiterUser = userRepository.save(User.builder()
                .email("recruiter.microsoft@campusx.edu")
                .password(passwordEncoder.encode("Recruiter@123"))
                .role(Role.RECRUITER)
                .firstName("Vikram")
                .lastName("Malhotra")
                .phone("+91-9876500011")
                .active(true)
                .build());

        recruiterProfileRepository.save(RecruiterProfile.builder()
                .user(msRecruiterUser)
                .company(microsoft)
                .designation("Senior Technical Recruiter")
                .approved(true)
                .build());

        // 4. Create Students & Portfolios
        // Student 1: Arjun Sharma (CSE, CGPA 8.85)
        User arjunUser = userRepository.save(User.builder()
                .email("student.arjun@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Arjun")
                .lastName("Sharma")
                .phone("+91-9876500020")
                .active(true)
                .build());

        StudentProfile arjunProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(arjunUser)
                .rollNumber("21CS042")
                .department("CSE")
                .cgpa(8.85)
                .graduationYear(2025)
                .bio("Aspiring Software Engineer passionate about distributed systems, cloud architecture, and modern full-stack web applications.")
                .githubUrl("https://github.com/arjun-sharma-demo")
                .linkedinUrl("https://linkedin.com/in/arjun-sharma-demo")
                .portfolioUrl("https://arjunsharma.dev")
                .resumeUrl("https://campusx.edu/resumes/arjun-sharma-resume.pdf")
                .profileCompletionPercentage(95)
                .placed(false)
                .build());

        educationRepository.save(Education.builder()
                .studentProfile(arjunProfile)
                .degree("B.Tech in Computer Science & Engineering")
                .institution("National Institute of Technology")
                .boardOrUniversity("Autonomous University")
                .startYear(2021)
                .endYear(2025)
                .score("8.85 CGPA")
                .completed(false)
                .build());

        educationRepository.save(Education.builder()
                .studentProfile(arjunProfile)
                .degree("Class XII (Senior Secondary CBSE)")
                .institution("Delhi Public School")
                .boardOrUniversity("CBSE")
                .startYear(2019)
                .endYear(2021)
                .score("95.4%")
                .completed(true)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(arjunProfile).skill(javaSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(arjunProfile).skill(springSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(arjunProfile).skill(reactSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(arjunProfile).skill(postgresSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(arjunProfile).skill(dockerSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        projectRepository.save(Project.builder()
                .studentProfile(arjunProfile)
                .title("Campus Placement & Recruitment System")
                .description("Production-grade portal using Spring Boot 3, Spring Security JWT, and React 18 with automated eligibility evaluation.")
                .technologies("Java 21, Spring Boot, React, Tailwind CSS, PostgreSQL")
                .githubUrl("https://github.com/campusx/placement-portal")
                .liveUrl("https://campusx-demo.vercel.app")
                .startDate(LocalDate.of(2024, 1, 10))
                .endDate(LocalDate.of(2024, 5, 20))
                .build());

        internshipRepository.save(Internship.builder()
                .studentProfile(arjunProfile)
                .companyName("Razorpay Software")
                .role("Backend Engineering Intern")
                .description("Worked with core payments team optimizing checkout transaction reconciliation pipelines.")
                .location("Bangalore, India")
                .startDate(LocalDate.of(2024, 5, 15))
                .endDate(LocalDate.of(2024, 7, 30))
                .certificateUrl("https://campusx.edu/certs/razorpay-intern.pdf")
                .build());

        certificationRepository.save(Certification.builder()
                .studentProfile(arjunProfile)
                .title("AWS Certified Solutions Architect - Associate")
                .issuingOrganization("Amazon Web Services")
                .issueDate(LocalDate.of(2023, 10, 15))
                .credentialId("AWS-SAA-98214")
                .credentialUrl("https://aws.amazon.com/verify?id=98214")
                .build());

        resumeRepository.save(Resume.builder()
                .studentProfile(arjunProfile)
                .fileName("Arjun_Sharma_SDE_Resume.pdf")
                .fileUrl("https://campusx.edu/resumes/Arjun_Sharma_SDE_Resume.pdf")
                .fileType("application/pdf")
                .fileSize(245000L)
                .primary(true)
                .build());

        // Student 2: Priya Patel (ECE, CGPA 7.90, Placed at Microsoft)
        User priyaUser = userRepository.save(User.builder()
                .email("student.priya@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Priya")
                .lastName("Patel")
                .phone("+91-9876500021")
                .active(true)
                .build());

        StudentProfile priyaProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(priyaUser)
                .rollNumber("21EC019")
                .department("ECE")
                .cgpa(7.90)
                .graduationYear(2025)
                .bio("Electronics and Communication engineer skilled in Embedded Systems, Cloud IoT, and Full Stack Development.")
                .githubUrl("https://github.com/priya-patel-ece")
                .linkedinUrl("https://linkedin.com/in/priya-patel-ece")
                .resumeUrl("https://campusx.edu/resumes/priya-patel-resume.pdf")
                .profileCompletionPercentage(85)
                .placed(true)
                .placedCompany("Microsoft")
                .placedPackageLpa(28.5)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(priyaProfile).skill(javaSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(priyaProfile).skill(awsSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(priyaProfile).skill(pythonSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());

        // Student 3: Ananya Iyer (CSE - AI/ML Specialist, CGPA 9.15, Placed at NVIDIA)
        User ananyaUser = userRepository.save(User.builder()
                .email("student.ananya@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Ananya")
                .lastName("Iyer")
                .phone("+91-9876500023")
                .active(true)
                .build());

        StudentProfile ananyaProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(ananyaUser)
                .rollNumber("21CS008")
                .department("CSE")
                .cgpa(9.15)
                .graduationYear(2025)
                .bio("Deep Learning & AI Systems researcher with published conference papers on transformer attention acceleration and CUDA kernels.")
                .githubUrl("https://github.com/ananya-ai")
                .linkedinUrl("https://linkedin.com/in/ananya-iyer-ai")
                .portfolioUrl("https://ananyaiyer.ai")
                .resumeUrl("https://campusx.edu/resumes/ananya-iyer-ai-cv.pdf")
                .profileCompletionPercentage(100)
                .placed(true)
                .placedCompany("NVIDIA")
                .placedPackageLpa(44.0)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(ananyaProfile).skill(cppSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.EXPERT).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(ananyaProfile).skill(pythonSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.EXPERT).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(ananyaProfile).skill(mlSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.EXPERT).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(ananyaProfile).skill(dsaSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.EXPERT).build());

        projectRepository.save(Project.builder()
                .studentProfile(ananyaProfile)
                .title("CUDA-Accelerated Sparse Matrix Multiplier")
                .description("High-performance CUDA C++ kernels achieving 4.2x speedup over cuBLAS for LLM attention caching.")
                .technologies("C++, CUDA, PyTorch, CMake")
                .githubUrl("https://github.com/ananya-ai/cuda-sparse-gemm")
                .build());

        // Student 4: Kabir Mehta (IT - Cloud & DevOps, CGPA 8.40)
        User kabirUser = userRepository.save(User.builder()
                .email("student.kabir@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Kabir")
                .lastName("Mehta")
                .phone("+91-9876500024")
                .active(true)
                .build());

        StudentProfile kabirProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(kabirUser)
                .rollNumber("21IT027")
                .department("IT")
                .cgpa(8.40)
                .graduationYear(2025)
                .bio("Cloud Infrastructure engineer and Kubernetes enthusiast specializing in zero-downtime microservice deployments and observability.")
                .githubUrl("https://github.com/kabirmehta-ops")
                .linkedinUrl("https://linkedin.com/in/kabir-mehta-devops")
                .profileCompletionPercentage(90)
                .placed(false)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(kabirProfile).skill(dockerSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(kabirProfile).skill(k8sSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(kabirProfile).skill(awsSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(kabirProfile).skill(javaSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        // Student 5: Sneha Nair (ECE - VLSI & Embedded, CGPA 7.65)
        User snehaUser = userRepository.save(User.builder()
                .email("student.sneha@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Sneha")
                .lastName("Nair")
                .phone("+91-9876500025")
                .active(true)
                .build());

        StudentProfile snehaProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(snehaUser)
                .rollNumber("21EC064")
                .department("ECE")
                .cgpa(7.65)
                .graduationYear(2025)
                .bio("Passionate about Digital System Design, ASIC prototyping, and firmware development on ARM Cortex MCUs.")
                .profileCompletionPercentage(80)
                .placed(false)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(snehaProfile).skill(vlsiSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(snehaProfile).skill(cppSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        // Student 6: Devanshi Rao (EE - Smart Grid & Automation, CGPA 8.10)
        User devanshiUser = userRepository.save(User.builder()
                .email("student.devanshi@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Devanshi")
                .lastName("Rao")
                .phone("+91-9876500026")
                .active(true)
                .build());

        StudentProfile devanshiProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(devanshiUser)
                .rollNumber("21EE015")
                .department("EE")
                .cgpa(8.10)
                .graduationYear(2025)
                .bio("Electrical Engineer bridging power systems with cloud IoT analytics, SCADA communication, and automation algorithms.")
                .profileCompletionPercentage(85)
                .placed(false)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(devanshiProfile).skill(pythonSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.ADVANCED).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(devanshiProfile).skill(postgresSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        // Student 7: Rahul Deshmukh (MECH - Robotics & CAD, CGPA 7.45)
        User rahulUser = userRepository.save(User.builder()
                .email("student.rahul@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Rahul")
                .lastName("Deshmukh")
                .phone("+91-9876500027")
                .active(true)
                .build());

        StudentProfile rahulProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(rahulUser)
                .rollNumber("21ME032")
                .department("MECH")
                .cgpa(7.45)
                .graduationYear(2025)
                .bio("Mechanical Engineer with practical robotics experience, ROS (Robot Operating System), kinematics, and numerical simulation.")
                .profileCompletionPercentage(75)
                .placed(false)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(rahulProfile).skill(pythonSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());
        studentSkillRepository.save(StudentSkill.builder().studentProfile(rahulProfile).skill(cppSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        // Student 8: Rohit Verma (Mechanical, CGPA 6.80)
        User rohitUser = userRepository.save(User.builder()
                .email("student.rohit@campusx.edu")
                .password(passwordEncoder.encode("Student@123"))
                .role(Role.STUDENT)
                .firstName("Rohit")
                .lastName("Verma")
                .phone("+91-9876500022")
                .active(true)
                .build());

        StudentProfile rohitProfile = studentProfileRepository.save(StudentProfile.builder()
                .user(rohitUser)
                .rollNumber("21ME055")
                .department("MECH")
                .cgpa(6.80)
                .graduationYear(2025)
                .bio("Mechanical Engineering student transitioning into Software Engineering and Industrial Automation.")
                .profileCompletionPercentage(70)
                .placed(false)
                .build());

        studentSkillRepository.save(StudentSkill.builder().studentProfile(rohitProfile).skill(pythonSkill).proficiencyLevel(StudentSkill.ProficiencyLevel.INTERMEDIATE).build());

        // 5. Create Placement Drives
        // Drive 1: Google SDE
        PlacementDrive googleDrive = driveRepository.save(PlacementDrive.builder()
                .company(google)
                .title("Software Development Engineer - I (SDE 1)")
                .description("Join Google's engineering team to build scalable systems, distributed data infrastructure, and AI-powered consumer services.")
                .jobRole("Software Development Engineer")
                .jobLocation("Bangalore / Hyderabad, India")
                .jobType("Full-time")
                .packageLpa(32.0)
                .minCgpa(8.0)
                .allowedBranches("CSE,IT")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(25))
                .status(DriveStatus.APPROVED)
                .createdBy(googleRecruiterUser)
                .build());

        // Drive 2: NVIDIA AI Systems
        PlacementDrive nvidiaDrive = driveRepository.save(PlacementDrive.builder()
                .company(nvidia)
                .title("AI Systems & GPU Kernel Engineer")
                .description("Develop low-level CUDA architectures, Deep Learning compilers (TensorRT), and distributed training communication libraries (NCCL).")
                .jobRole("AI Systems Engineer")
                .jobLocation("Pune / Bangalore, India")
                .jobType("Full-time")
                .packageLpa(44.0)
                .minCgpa(8.5)
                .allowedBranches("CSE,IT,ECE")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(15))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 3: Microsoft Cloud & DevOps
        PlacementDrive msDrive = driveRepository.save(PlacementDrive.builder()
                .company(microsoft)
                .title("Cloud & DevOps Engineer - Azure Core")
                .description("Help millions of enterprise customers scale with confidence on Azure. Work on core hyper-scale infrastructure and orchestration.")
                .jobRole("Cloud Infrastructure Engineer")
                .jobLocation("Hyderabad, India")
                .jobType("Full-time")
                .packageLpa(28.5)
                .minCgpa(7.5)
                .allowedBranches("CSE,IT,ECE")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(18))
                .status(DriveStatus.APPROVED)
                .createdBy(msRecruiterUser)
                .build());

        // Drive 4: Goldman Sachs Quant
        PlacementDrive goldmanDrive = driveRepository.save(PlacementDrive.builder()
                .company(goldman)
                .title("Quantitative Analyst & Financial Engineer")
                .description("Design mathematical pricing models, low-latency algorithmic trading systems, and real-time risk analytics platforms.")
                .jobRole("Quantitative Financial Engineer")
                .jobLocation("Bangalore, India")
                .jobType("Full-time")
                .packageLpa(36.0)
                .minCgpa(8.2)
                .allowedBranches("CSE,IT,ECE,EE,MECH")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(20))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 5: Uber Distributed Systems
        PlacementDrive uberDrive = driveRepository.save(PlacementDrive.builder()
                .company(uber)
                .title("Backend Platform & Distributed Systems Engineer")
                .description("Work on real-time geospatial dispatching, dynamic pricing algorithms, and fault-tolerant microservice platforms handling millions of trips.")
                .jobRole("Backend Platform Engineer")
                .jobLocation("Bangalore / Hyderabad, India")
                .jobType("Full-time")
                .packageLpa(38.0)
                .minCgpa(8.0)
                .allowedBranches("CSE,IT")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(16))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 6: Adobe Product Developer
        PlacementDrive adobeDrive = driveRepository.save(PlacementDrive.builder()
                .company(adobe)
                .title("Product Software Developer (Creative Cloud)")
                .description("Build next-generation digital imaging, vector graphics rendering, and generative AI features for Creative Cloud apps.")
                .jobRole("Software Developer")
                .jobLocation("Noida / Bangalore, India")
                .jobType("Full-time")
                .packageLpa(30.0)
                .minCgpa(7.8)
                .allowedBranches("CSE,IT")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(22))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 7: Atlassian SRE
        PlacementDrive atlassianDrive = driveRepository.save(PlacementDrive.builder()
                .company(atlassian)
                .title("Site Reliability & Cloud Infrastructure Engineer")
                .description("Champion high availability and resilience across Jira, Confluence, and Atlassian Cloud platform.")
                .jobRole("Site Reliability Engineer")
                .jobLocation("Bangalore (Remote)")
                .jobType("Full-time")
                .packageLpa(26.0)
                .minCgpa(7.5)
                .allowedBranches("CSE,IT,ECE")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(14))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 8: Amazon SDE
        PlacementDrive amazonDrive = driveRepository.save(PlacementDrive.builder()
                .company(amazon)
                .title("SDE Intern + FTE Conversion")
                .description("Innovate on behalf of customers across Amazon Web Services and E-Commerce Retail Systems.")
                .jobRole("Software Development Engineer")
                .jobLocation("Bangalore, India")
                .jobType("FTE + Internship")
                .packageLpa(24.0)
                .minCgpa(7.0)
                .allowedBranches("CSE,IT,ECE,EE")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(12))
                .status(DriveStatus.APPROVED)
                .build());

        // Drive 9: TCS Digital
        PlacementDrive tcsDrive = driveRepository.save(PlacementDrive.builder()
                .company(tcs)
                .title("TCS Digital Specialist Engineer")
                .description("TCS Digital stream for high-potential engineering students specializing in Next-Gen Cloud, AI/ML, and IoT.")
                .jobRole("Digital Specialist Engineer")
                .jobLocation("Pan-India")
                .jobType("Full-time")
                .packageLpa(9.0)
                .minCgpa(6.5)
                .allowedBranches("ALL")
                .graduationYear(2025)
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(DriveStatus.APPROVED)
                .build());

        // 6. Create Applications, Interviews & Offers
        // Arjun -> Google (Interview Scheduled)
        Application arjunGoogleApp = applicationRepository.save(Application.builder()
                .placementDrive(googleDrive)
                .studentProfile(arjunProfile)
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .coverNote("Eager to contribute to Google's distributed systems team with high-throughput backend experience.")
                .build());

        interviewRepository.save(Interview.builder()
                .application(arjunGoogleApp)
                .roundName("Round 2: Data Structures & System Design")
                .interviewType(Interview.InterviewType.ONLINE)
                .scheduledAt(LocalDateTime.now().plusDays(2).withHour(14).withMinute(30))
                .durationMinutes(60)
                .meetingLink("https://meet.google.com/xyz-goog-demo")
                .interviewerName("Sarah Jenkins (Staff SWE)")
                .status(Interview.InterviewStatus.SCHEDULED)
                .feedback("Strong performance in Round 1 algorithmic screening. Advancing to architectural round.")
                .build());

        // Arjun -> Microsoft (Shortlisted)
        applicationRepository.save(Application.builder()
                .placementDrive(msDrive)
                .studentProfile(arjunProfile)
                .status(ApplicationStatus.SHORTLISTED)
                .coverNote("Strong interest in Azure distributed storage.")
                .build());

        // Ananya -> NVIDIA (Selected & Offer Accepted)
        Application ananyaNvidiaApp = applicationRepository.save(Application.builder()
                .placementDrive(nvidiaDrive)
                .studentProfile(ananyaProfile)
                .status(ApplicationStatus.SELECTED)
                .coverNote("Deep passion for GPU acceleration, CUDA compiler optimization, and TensorRT systems.")
                .build());

        interviewRepository.save(Interview.builder()
                .application(ananyaNvidiaApp)
                .roundName("GPU Architecture & CUDA Deep Dive")
                .interviewType(Interview.InterviewType.ONLINE)
                .scheduledAt(LocalDateTime.now().minusDays(8).withHour(15).withMinute(0))
                .durationMinutes(75)
                .meetingLink("https://meet.google.com/nvd-ananya-ai")
                .interviewerName("Dr. Torsten Hoefler (Principal AI Architect)")
                .status(Interview.InterviewStatus.COMPLETED)
                .feedback("Exceptional mastery of CUDA memory hierarchies, warp divergence, and matrix tiling.")
                .build());

        Offer ananyaOffer = offerRepository.save(Offer.builder()
                .application(ananyaNvidiaApp)
                .studentProfile(ananyaProfile)
                .company(nvidia)
                .designation("AI Systems & CUDA Engineer")
                .packageLpa(44.0)
                .joiningDate(LocalDate.of(2025, 7, 1))
                .offerExpiryDate(LocalDate.now().plusDays(15))
                .offerLetterUrl("https://campusx.edu/offers/nvidia-ananya-iyer.pdf")
                .status(Offer.OfferStatus.ACCEPTED)
                .build());

        // Priya -> Microsoft (Selected & Offer Accepted)
        Application priyaMsApp = applicationRepository.save(Application.builder()
                .placementDrive(msDrive)
                .studentProfile(priyaProfile)
                .status(ApplicationStatus.SELECTED)
                .coverNote("Excited about Azure edge computing systems.")
                .build());

        interviewRepository.save(Interview.builder()
                .application(priyaMsApp)
                .roundName("Final Technical & Culture Round")
                .interviewType(Interview.InterviewType.ONLINE)
                .scheduledAt(LocalDateTime.now().minusDays(5).withHour(11).withMinute(0))
                .durationMinutes(45)
                .meetingLink("https://teams.microsoft.com/l/meetup-join/demo-priya")
                .interviewerName("Vikram Malhotra")
                .status(Interview.InterviewStatus.COMPLETED)
                .feedback("Excellent communication, high proficiency in cloud computing architectures.")
                .build());

        Offer priyaOffer = offerRepository.save(Offer.builder()
                .application(priyaMsApp)
                .studentProfile(priyaProfile)
                .company(microsoft)
                .designation("Cloud Solutions Engineer")
                .packageLpa(28.5)
                .joiningDate(LocalDate.of(2025, 7, 15))
                .offerExpiryDate(LocalDate.now().plusDays(10))
                .offerLetterUrl("https://campusx.edu/offers/microsoft-priya-patel.pdf")
                .status(Offer.OfferStatus.ACCEPTED)
                .build());

        // Kabir -> Atlassian (Interview Scheduled)
        Application kabirAtlassianApp = applicationRepository.save(Application.builder()
                .placementDrive(atlassianDrive)
                .studentProfile(kabirProfile)
                .status(ApplicationStatus.INTERVIEW_SCHEDULED)
                .coverNote("Experienced in Kubernetes automation, Prometheus monitoring, and Terraform.")
                .build());

        interviewRepository.save(Interview.builder()
                .application(kabirAtlassianApp)
                .roundName("System Reliability & Chaos Engineering")
                .interviewType(Interview.InterviewType.ONLINE)
                .scheduledAt(LocalDateTime.now().plusDays(3).withHour(16).withMinute(0))
                .durationMinutes(60)
                .meetingLink("https://meet.google.com/atl-kabir-sre")
                .interviewerName("Dave Campbell (Senior SRE Manager)")
                .status(Interview.InterviewStatus.SCHEDULED)
                .feedback("Cleared Round 1 infrastructure scripting. Moving to reliability engineering case study.")
                .build());

        // Devanshi -> Amazon (Shortlisted)
        applicationRepository.save(Application.builder()
                .placementDrive(amazonDrive)
                .studentProfile(devanshiProfile)
                .status(ApplicationStatus.SHORTLISTED)
                .coverNote("Keen to work on AWS IoT Fleetwise and distributed telemetry.")
                .build());

        // Rahul -> Goldman Sachs (Applied)
        applicationRepository.save(Application.builder()
                .placementDrive(goldmanDrive)
                .studentProfile(rahulProfile)
                .status(ApplicationStatus.APPLIED)
                .coverNote("Strong quantitative and computational background.")
                .build());

        // Rohit -> TCS (Applied)
        applicationRepository.save(Application.builder()
                .placementDrive(tcsDrive)
                .studentProfile(rohitProfile)
                .status(ApplicationStatus.APPLIED)
                .coverNote("Keen to pursue software career in IoT automation.")
                .build());

        // 7. Create Initial Notifications
        notificationRepository.save(Notification.builder()
                .recipient(arjunUser)
                .title("Interview Scheduled: Google LLC")
                .message("Your Round 2 interview for SDE 1 is scheduled for 2 days from now at 02:30 PM.")
                .type(Notification.NotificationType.INTERVIEW_ALERT)
                .link("/student/interviews")
                .read(false)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(ananyaUser)
                .title("🎉 Dream Offer Letter: NVIDIA")
                .message("Congratulations! NVIDIA has extended a formal offer of 44.00 LPA for AI Systems & CUDA Engineer.")
                .type(Notification.NotificationType.OFFER_ALERT)
                .link("/student/offers")
                .read(true)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(kabirUser)
                .title("Interview Scheduled: Atlassian")
                .message("Your SRE Technical round with Atlassian is confirmed for 3 days from now.")
                .type(Notification.NotificationType.INTERVIEW_ALERT)
                .link("/student/interviews")
                .read(false)
                .build());

        notificationRepository.save(Notification.builder()
                .recipient(priyaUser)
                .title("🎉 Official Job Offer: Microsoft")
                .message("Congratulations! Microsoft has extended an offer of 28.50 LPA for Cloud Solutions Engineer.")
                .type(Notification.NotificationType.OFFER_ALERT)
                .link("/student/offers")
                .read(true)
                .build());

        // 8. Initial Audit Logs
        auditLogRepository.save(AuditLog.builder()
                .action("SYSTEM_INIT")
                .performedBy("SYSTEM")
                .targetEntity("Database")
                .entityId("0")
                .details("CampusX Platform initialized with multi-tier companies, placement drives, and verified candidate portfolios.")
                .ipAddress("127.0.0.1")
                .build());

        auditLogRepository.save(AuditLog.builder()
                .action("OFFER_ACCEPTED")
                .performedBy("student.ananya@campusx.edu")
                .targetEntity("Offer")
                .entityId(ananyaOffer.getId().toString())
                .details("Student Ananya Iyer accepted offer from NVIDIA for 44.00 LPA (Highest Campus Package)")
                .ipAddress("127.0.0.1")
                .build());

        auditLogRepository.save(AuditLog.builder()
                .action("OFFER_ACCEPTED")
                .performedBy("student.priya@campusx.edu")
                .targetEntity("Offer")
                .entityId(priyaOffer.getId().toString())
                .details("Student Priya Patel accepted offer from Microsoft for 28.50 LPA")
                .ipAddress("127.0.0.1")
                .build());

        log.info("Demo data seeding successfully completed! 9 companies and 8 students ready for evaluation.");
    }
}
