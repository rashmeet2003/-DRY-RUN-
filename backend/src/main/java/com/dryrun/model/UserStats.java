package com.dryrun.model;

import jakarta.persistence.*;

/**
 * JPA Entity representing the User's Gamified Progress stats.
 * Persists user's active streak, total XP, and remaining lives (hearts).
 */
@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    private int streak;
    private int xp;
    private int hearts;

    // Constructors
    public UserStats() {
    }

    public UserStats(String username, int streak, int xp, int hearts) {
        this.username = username;
        this.streak = streak;
        this.xp = xp;
        this.hearts = hearts;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getStreak() {
        return streak;
    }

    public void setStreak(int streak) {
        this.streak = streak;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public int getHearts() {
        return hearts;
    }

    public void setHearts(int hearts) {
        this.hearts = hearts;
    }
}
