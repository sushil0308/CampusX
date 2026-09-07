package com.campusx.application;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentProfileIdOrderByAppliedAtDesc(Long studentProfileId);
    List<Application> findByPlacementDriveIdOrderByAppliedAtDesc(Long placementDriveId);
    Optional<Application> findByPlacementDriveIdAndStudentProfileId(Long placementDriveId, Long studentProfileId);
    boolean existsByPlacementDriveIdAndStudentProfileId(Long placementDriveId, Long studentProfileId);
    long countByStatus(ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.placementDrive.company.id = :companyId ORDER BY a.appliedAt DESC")
    List<Application> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.placementDrive.company.id = :companyId")
    long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.placementDrive.company.id = :companyId AND a.status = :status")
    long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") ApplicationStatus status);
}
