package com.campusx.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByStudentProfileIdOrderByUploadedAtDesc(Long profileId);
    Optional<Resume> findByStudentProfileIdAndPrimaryTrue(Long profileId);
}
