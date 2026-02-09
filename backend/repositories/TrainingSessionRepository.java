package com.neuraflow.backend.repository;

import com.neuraflow.backend.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrainingSessionRepository 
        extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findByUserId(Long userId);
}
