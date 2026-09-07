package com.campusx.offer;

import com.campusx.admin.AuditLogService;
import com.campusx.application.Application;
import com.campusx.application.ApplicationRepository;
import com.campusx.application.ApplicationStatus;
import com.campusx.common.BadRequestException;
import com.campusx.common.ResourceNotFoundException;
import com.campusx.company.Company;
import com.campusx.notification.Notification;
import com.campusx.notification.NotificationService;
import com.campusx.offer.OfferDtos.CreateOfferRequest;
import com.campusx.offer.OfferDtos.RespondOfferRequest;
import com.campusx.recruiter.RecruiterProfile;
import com.campusx.recruiter.RecruiterProfileRepository;
import com.campusx.security.UserPrincipal;
import com.campusx.student.StudentProfile;
import com.campusx.student.StudentProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final RecruiterProfileRepository recruiterProfileRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Transactional
    public Offer generateOffer(UserPrincipal currentUser, CreateOfferRequest req) {
        Application application = applicationRepository.findById(req.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", req.getApplicationId()));

        Company company = application.getPlacementDrive().getCompany();
        StudentProfile student = application.getStudentProfile();

        Offer offer = Offer.builder()
                .application(application)
                .studentProfile(student)
                .company(company)
                .designation(req.getDesignation().trim())
                .packageLpa(req.getPackageLpa())
                .joiningDate(req.getJoiningDate() != null ? req.getJoiningDate() : LocalDate.now().plusMonths(6))
                .offerExpiryDate(req.getOfferExpiryDate() != null ? req.getOfferExpiryDate() : LocalDate.now().plusDays(14))
                .offerLetterUrl(req.getOfferLetterUrl() != null ? req.getOfferLetterUrl().trim() : "https://campusx.edu/offers/sample-letter.pdf")
                .status(Offer.OfferStatus.OFFERED)
                .build();

        Offer saved = offerRepository.save(offer);

        // Update application status to SELECTED
        application.setStatus(ApplicationStatus.SELECTED);
        applicationRepository.save(application);

        // Notify student
        notificationService.createNotification(
                student.getUser(),
                "🎉 Official Job Offer from " + company.getName(),
                String.format("Congratulations! %s has extended an official job offer for %s with CTC of %.2f LPA.",
                        company.getName(), offer.getDesignation(), offer.getPackageLpa()),
                Notification.NotificationType.OFFER_ALERT,
                "/student/offers"
        );

        auditLogService.log("OFFER_GENERATED", currentUser.getEmail(), "Offer", saved.getId().toString(),
                String.format("Generated offer of %.2f LPA from %s for %s", offer.getPackageLpa(), company.getName(), student.getUser().getFullName()), null);

        return saved;
    }

    @Transactional
    public Offer respondToOffer(Long offerId, RespondOfferRequest req, UserPrincipal currentUser) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new ResourceNotFoundException("Offer", "id", offerId));

        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));

        if (!offer.getStudentProfile().getId().equals(student.getId())) {
            throw new BadRequestException("You can only respond to your own offers");
        }

        offer.setStatus(req.getStatus());
        Offer saved = offerRepository.save(offer);

        if (req.getStatus() == Offer.OfferStatus.ACCEPTED) {
            student.setPlaced(true);
            student.setPlacedCompany(offer.getCompany().getName());
            student.setPlacedPackageLpa(offer.getPackageLpa());
            studentProfileRepository.save(student);

            auditLogService.log("OFFER_ACCEPTED", currentUser.getEmail(), "Offer", saved.getId().toString(),
                    String.format("Student accepted offer from %s (%.2f LPA)", offer.getCompany().getName(), offer.getPackageLpa()), null);
        } else {
            auditLogService.log("OFFER_REJECTED", currentUser.getEmail(), "Offer", saved.getId().toString(),
                    String.format("Student declined offer from %s", offer.getCompany().getName()), null);
        }

        return saved;
    }

    @Transactional(readOnly = true)
    public List<Offer> getStudentOffers(UserPrincipal currentUser) {
        StudentProfile student = studentProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Student profile not found"));
        return offerRepository.findByStudentProfileIdOrderByCreatedAtDesc(student.getId());
    }

    @Transactional(readOnly = true)
    public List<Offer> getCompanyOffers(UserPrincipal currentUser) {
        RecruiterProfile recruiter = recruiterProfileRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BadRequestException("Recruiter profile not found"));
        if (recruiter.getCompany() == null) return List.of();
        return offerRepository.findByCompanyIdOrderByCreatedAtDesc(recruiter.getCompany().getId());
    }
}
