package com.campusx.student;

import com.campusx.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    List<StudentProfile> findByDepartment(String department);
    List<StudentProfile> findByPlaced(boolean placed);
    long countByPlaced(boolean placed);
}
