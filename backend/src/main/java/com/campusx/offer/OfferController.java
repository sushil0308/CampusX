package com.campusx.offer;

import com.campusx.common.ApiResponse;
import com.campusx.offer.OfferDtos.CreateOfferRequest;
import com.campusx.offer.OfferDtos.RespondOfferRequest;
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
public class OfferController {

    private final OfferService offerService;

    @PostMapping("/recruiter/offers")
    public ResponseEntity<ApiResponse<Offer>> generateOffer(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateOfferRequest request) {
        Offer offer = offerService.generateOffer(currentUser, request);
        return new ResponseEntity<>(ApiResponse.success("Job offer generated successfully", offer), HttpStatus.CREATED);
    }

    @GetMapping("/student/offers")
    public ResponseEntity<ApiResponse<List<Offer>>> getStudentOffers(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Offer> offers = offerService.getStudentOffers(currentUser);
        return ResponseEntity.ok(ApiResponse.success(offers));
    }

    @PatchMapping("/student/offers/{id}/respond")
    public ResponseEntity<ApiResponse<Offer>> respondToOffer(
            @PathVariable Long id,
            @Valid @RequestBody RespondOfferRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        Offer updated = offerService.respondToOffer(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.success("Offer response recorded: " + request.getStatus(), updated));
    }

    @GetMapping("/recruiter/offers")
    public ResponseEntity<ApiResponse<List<Offer>>> getCompanyOffers(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Offer> offers = offerService.getCompanyOffers(currentUser);
        return ResponseEntity.ok(ApiResponse.success(offers));
    }
}
