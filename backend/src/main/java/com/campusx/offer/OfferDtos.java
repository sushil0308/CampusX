package com.campusx.offer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public class OfferDtos {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateOfferRequest {
        @NotNull(message = "Application ID is required")
        private Long applicationId;
        @NotBlank(message = "Designation is required")
        private String designation;
        @NotNull(message = "Package LPA is required")
        private Double packageLpa;
        private LocalDate joiningDate;
        private LocalDate offerExpiryDate;
        private String offerLetterUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RespondOfferRequest {
        @NotNull(message = "Response status is required")
        private Offer.OfferStatus status; // ACCEPTED or REJECTED
    }
}
