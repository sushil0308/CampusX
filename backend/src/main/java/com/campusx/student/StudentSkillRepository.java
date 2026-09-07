package com.campusx.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudentProfileId(Long profileId);
    boolean existsByStudentProfileIdAndSkillId(Long profileId, Long skillId);
    void deleteByStudentProfileIdAndSkillId(Long profileId, Long skillId);
}
