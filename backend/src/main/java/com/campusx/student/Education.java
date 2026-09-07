package com.campusx.student;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "student_educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String degree; // e.g. B.Tech Computer Science, Higher Secondary (12th), Secondary (10th)

    @NotBlank
    @Column(nullable = false, length = 150)
    private String institution;

    @Column(name = "board_or_university", length = 150)
    private String boardOrUniversity;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(length = 20)
    private String score; // e.g. "8.9 CGPA" or "94.5%"

    @Builder.Default
    @Column(name = "is_completed")
    private boolean completed = true;
}
