package com.campusx.placement;

import com.campusx.company.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {
    List<PlacementDrive> findByCompany(Company company);
    List<PlacementDrive> findByStatus(DriveStatus status);
    List<PlacementDrive> findByStatusIn(List<DriveStatus> statuses);
    List<PlacementDrive> findByCompanyId(Long companyId);
    long countByStatus(DriveStatus status);
    List<PlacementDrive> findByApplicationDeadlineAfter(LocalDate date);
}
