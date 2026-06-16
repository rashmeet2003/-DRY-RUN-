package com.dryrun.repository;

import com.dryrun.model.LessonStep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for LessonStep Entity.
 * Provides custom query methods to retrieve a specific challenge step of a DSA problem.
 */
@Repository
public interface LessonStepRepository extends JpaRepository<LessonStep, Long> {
    Optional<LessonStep> findByProblemNameAndStepNumber(String problemName, int stepNumber);
}
