package com.dryrun.model;

import jakarta.persistence.*;

/**
 * JPA Entity representing a single pointer/logic state step in a LeetCode visual deconstruction lesson.
 * Defines the question, expected pointer states (L and R index locations), correct choice, and explanations.
 */
@Entity
@Table(name = "lesson_steps")
public class LessonStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem_name", nullable = false)
    private String problemName; // e.g. "leetcode-11"

    @Column(name = "step_number", nullable = false)
    private int stepNumber; // e.g. 1, 2, 3

    @Column(name = "left_index")
    private int leftIndex; // Index pointer L is currently pointing at

    @Column(name = "right_index")
    private int rightIndex; // Index pointer R is currently pointing at

    @Column(nullable = false, length = 500)
    private String question;

    @Column(name = "option_a", nullable = false)
    private String optionA;

    @Column(name = "option_b", nullable = false)
    private String optionB;

    @Column(name = "correct_option", nullable = false, length = 1)
    private String correctOption; // "A" or "B"

    @Column(length = 1000)
    private String explanation;

    // Constructors
    public LessonStep() {
    }

    public LessonStep(String problemName, int stepNumber, int leftIndex, int rightIndex, 
                      String question, String optionA, String optionB, String correctOption, String explanation) {
        this.problemName = problemName;
        this.stepNumber = stepNumber;
        this.leftIndex = leftIndex;
        this.rightIndex = rightIndex;
        this.question = question;
        this.optionA = optionA;
        this.optionB = optionB;
        this.correctOption = correctOption;
        this.explanation = explanation;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProblemName() {
        return problemName;
    }

    public void setProblemName(String problemName) {
        this.problemName = problemName;
    }

    public int getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(int stepNumber) {
        this.stepNumber = stepNumber;
    }

    public int getLeftIndex() {
        return leftIndex;
    }

    public void setLeftIndex(int leftIndex) {
        this.leftIndex = leftIndex;
    }

    public int getRightIndex() {
        return rightIndex;
    }

    public void setRightIndex(int rightIndex) {
        this.rightIndex = rightIndex;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getCorrectOption() {
        return correctOption;
    }

    public void setCorrectOption(String correctOption) {
        this.correctOption = correctOption;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
