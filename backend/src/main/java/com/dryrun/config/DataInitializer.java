package com.dryrun.config;

import com.dryrun.model.LessonStep;
import com.dryrun.model.UserStats;
import com.dryrun.repository.LessonStepRepository;
import com.dryrun.repository.UserStatsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

/**
 * Seeds default data into H2 database on application startup.
 * Ensures a test user and the steps for LeetCode 11 (Container with Most Water)
 * are populated in the in-memory database.
 */
@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserStatsRepository userStatsRepository;
    private final LessonStepRepository lessonStepRepository;

    public DataInitializer(UserStatsRepository userStatsRepository, LessonStepRepository lessonStepRepository) {
        this.userStatsRepository = userStatsRepository;
        this.lessonStepRepository = lessonStepRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Default User Stats
        if (userStatsRepository.findByUsername("Developer1").isEmpty()) {
            UserStats devUser = new UserStats("Developer1", 12, 350, 5);
            userStatsRepository.save(devUser);
            System.out.println("🌱 Seeded test user: Developer1 (Streak: 12, XP: 350, Hearts: 5)");
        }

        // 2. Seed Lesson Steps for LeetCode 11 (Container with Most Water)
        if (lessonStepRepository.findByProblemNameAndStepNumber("leetcode-11", 1).isEmpty()) {
            
            // Step 1: L=0, R=8. heights[0]=1, heights[8]=7. Move L++ (Option B)
            LessonStep step1 = new LessonStep(
                "leetcode-11", 1, 0, 8,
                "Currently L points to index 0 (height 1) and R points to index 8 (height 7). To maximize water area, which pointer should move next?",
                "Move Right Pointer Leftwards (R--)",
                "Move Left Pointer Rightwards (L++)",
                "B",
                "Since Height[L] (1) < Height[R] (7), moving L to the right (L++) is the only way to possibly find a taller line. Width is 8. Area = 1 * 8 = 8."
            );
            
            // Step 2: L=1, R=8. heights[1]=8, heights[8]=7. Move R-- (Option A)
            LessonStep step2 = new LessonStep(
                "leetcode-11", 2, 1, 8,
                "Currently L points to index 1 (height 8) and R points to index 8 (height 7). To maximize water area, which pointer should move next?",
                "Move Right Pointer Leftwards (R--)",
                "Move Left Pointer Rightwards (L++)",
                "A",
                "Perfect! Height[R] (7) < Height[L] (8). Moving R leftwards (R--) allows us to search for a line taller than 7. Width decreases to 7. Area was 7 * 7 = 49."
            );
            
            // Step 3: L=1, R=7. heights[1]=8, heights[7]=3. Move R-- (Option A)
            LessonStep step3 = new LessonStep(
                "leetcode-11", 3, 1, 7,
                "Currently L points to index 1 (height 8) and R points to index 7 (height 3). To maximize water area, which pointer should move next?",
                "Move Right Pointer Leftwards (R--)",
                "Move Left Pointer Rightwards (L++)",
                "A",
                "Exactly! Height[R] (3) < Height[L] (8). Moving R leftwards (R--) is the optimal choice. Width decreases to 6. Area is 3 * 6 = 18."
            );
            
            lessonStepRepository.save(step1);
            lessonStepRepository.save(step2);
            lessonStepRepository.save(step3);
            
            System.out.println("🌱 Seeded 3 steps for LeetCode 11: Container with Most Water");
        }
    }
}
