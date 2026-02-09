package com.neuraflow.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class TrainingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String taskType;
    private double accuracy;
    private int reactionTimeMs;
    private LocalDateTime createdAt = LocalDateTime.now();

    // getters & setters
}
