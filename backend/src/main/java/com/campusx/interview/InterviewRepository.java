package com.campusx.interview;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationIdOrderByScheduledAtAsc(Long applicationId);

    @Query("SELECT i FROM Interview i WHERE i.application.studentProfile.id = :studentProfileId ORDER BY i.scheduledAt ASC")
    List<Interview> findByStudentProfileId(@Param("studentProfileId") Long studentProfileId);

    @Query("SELECT i FROM Interview i WHERE i.application.placementDrive.company.id = :companyId ORDER BY i.scheduledAt ASC")
    List<Interview> findByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT i FROM Interview i WHERE i.application.studentProfile.id = :studentProfileId AND i.scheduledAt >= :now AND i.status = 'SCHEDULED' ORDER BY i.scheduledAt ASC")
    List<Interview> findUpcomingByStudentProfileId(@Param("studentProfileId") Long studentProfileId, @Param("now") LocalDateTime now);

    long countByStatus(Interview.InterviewStatus status);
}
