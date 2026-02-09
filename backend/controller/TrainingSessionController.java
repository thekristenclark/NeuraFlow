package com.neuraflow.backend.controller;

import com.neuraflow.backend.model.TrainingSession;
import com.neuraflow.backend.repository.TrainingSessionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin
public class TrainingSessionController {

    private final TrainingSessionRepository repository;

    public TrainingSessionController(TrainingSessionRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public TrainingSession saveSession(@RequestBody TrainingSession session) {
        return repository.save(session);
    }

    @GetMapping("/user/{userId}")
    public List<TrainingSession> getUserSessions(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }
}
