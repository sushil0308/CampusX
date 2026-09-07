package com.campusx.offer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByStudentProfileIdOrderByCreatedAtDesc(Long studentProfileId);
    Optional<Offer> findByApplicationId(Long applicationId);
    List<Offer> findByCompanyIdOrderByCreatedAtDesc(Long companyId);
    List<Offer> findByStatus(Offer.OfferStatus status);
    long countByStatus(Offer.OfferStatus status);

    @Query("SELECT AVG(o.packageLpa) FROM Offer o WHERE o.status = 'ACCEPTED' OR o.status = 'OFFERED'")
    Double findAveragePackage();

    @Query("SELECT MAX(o.packageLpa) FROM Offer o")
    Double findHighestPackage();
}
