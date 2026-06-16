package com.dryrun.controller;

import com.dryrun.model.UserStats;
import com.dryrun.repository.UserStatsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing user gamification statistics.
 * Provides endpoints to fetch and reset active user states.
 * CORS is allowed globally to accommodate local prototype client integrations.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserStatsController {

    private final UserStatsRepository userStatsRepository;

    public UserStatsController(UserStatsRepository userStatsRepository) {
        this.userStatsRepository = userStatsRepository;
    }

    /**
     * GET /api/stats
     * Returns the active user statistics.
     */
    @GetMapping("/stats")
    public ResponseEntity<UserStats> getStats() {
        return userStatsRepository.findByUsername("Developer1")
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/reset
     * Resets user statistics to default values (streak=12, XP=350, hearts=5).
     */
    @PostMapping("/reset")
    public ResponseEntity<UserStats> resetStats() {
        return userStatsRepository.findByUsername("Developer1")
                .map(stats -> {
                    stats.setStreak(12);
                    stats.setXp(350);
                    stats.setHearts(5);
                    UserStats saved = userStatsRepository.save(stats);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
