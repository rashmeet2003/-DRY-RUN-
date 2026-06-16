package com.dryrun.repository;

import com.dryrun.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for UserStats Entity.
 * Provides default CRUD query methods and helper queries to fetch stats by username.
 */
@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {
    Optional<UserStats> findByUsername(String username);
}
