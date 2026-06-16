package com.dryrun.controller;

import com.dryrun.model.LessonStep;
import com.dryrun.model.UserStats;
import com.dryrun.repository.LessonStepRepository;
import com.dryrun.repository.UserStatsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller managing coding lessons and checking logic sub-puzzles.
 * Hosts step retrieval and logic choice validation endpoints.
 */
@RestController
@RequestMapping("/api/lesson")
@CrossOrigin(origins = "*")
public class LessonStepController {

    private final LessonStepRepository lessonStepRepository;
    private final UserStatsRepository userStatsRepository;

    public LessonStepController(LessonStepRepository lessonStepRepository, UserStatsRepository userStatsRepository) {
        this.lessonStepRepository = lessonStepRepository;
        this.userStatsRepository = userStatsRepository;
    }

    /**
     * GET /api/lesson/step/{stepNum}
     * Returns details of a specific step for the LeetCode 11 problem.
     */
    @GetMapping("/step/{stepNum}")
    public ResponseEntity<LessonStep> getStep(@PathVariable int stepNum) {
        return lessonStepRepository.findByProblemNameAndStepNumber("leetcode-11", stepNum)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/lesson/validate
     * Accepts user answers, updates XP/hearts in the database, and returns validation feedback.
     */
    @PostMapping("/validate")
    public ResponseEntity<ValidationResponse> validateAnswer(@RequestBody ValidationRequest request) {
        // Fetch User
        UserStats user = userStatsRepository.findByUsername("Developer1")
                .orElseThrow(() -> new RuntimeException("Test user 'Developer1' not found"));

        // Fetch target step logic
        LessonStep step = lessonStepRepository.findByProblemNameAndStepNumber("leetcode-11", request.getStepNumber())
                .orElseThrow(() -> new RuntimeException("Lesson step not found: " + request.getStepNumber()));

        boolean isCorrect = step.getCorrectOption().equalsIgnoreCase(request.getSelectedChoice());

        if (isCorrect) {
            // Add XP (50 for standard step; bonus 100 for final step 3 completion)
            int xpGained = 50;
            if (request.getStepNumber() == 3) {
                xpGained += 100;
            }
            user.setXp(user.getXp() + xpGained);
        } else {
            // Deduct Heart
            user.setHearts(Math.max(0, user.getHearts() - 1));
        }

        // Save updated stats
        UserStats updatedUser = userStatsRepository.save(user);

        // Build Response
        ValidationResponse response = new ValidationResponse(
                isCorrect,
                step.getExplanation(),
                updatedUser.getXp(),
                updatedUser.getHearts()
        );

        return ResponseEntity.ok(response);
    }

    // --- Inner Payload DTO Classes ---

    public static class ValidationRequest {
        private int stepNumber;
        private String selectedChoice;

        public ValidationRequest() {}

        public int getStepNumber() {
            return stepNumber;
        }

        public void setStepNumber(int stepNumber) {
            this.stepNumber = stepNumber;
        }

        public String getSelectedChoice() {
            return selectedChoice;
        }

        public void setSelectedChoice(String selectedChoice) {
            this.selectedChoice = selectedChoice;
        }
    }

    public static class ValidationResponse {
        private boolean correct;
        private String explanation;
        private int updatedXp;
        private int updatedHearts;

        public ValidationResponse(boolean correct, String explanation, int updatedXp, int updatedHearts) {
            this.correct = correct;
            this.explanation = explanation;
            this.updatedXp = updatedXp;
            this.updatedHearts = updatedHearts;
        }

        public boolean isCorrect() {
            return correct;
        }

        public void setCorrect(boolean correct) {
            this.correct = correct;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }

        public int getUpdatedXp() {
            return updatedXp;
        }

        public void setUpdatedXp(int updatedXp) {
            this.updatedXp = updatedXp;
        }

        public int getUpdatedHearts() {
            return updatedHearts;
        }

        public void setUpdatedHearts(int updatedHearts) {
            this.updatedHearts = updatedHearts;
        }
    }
}
