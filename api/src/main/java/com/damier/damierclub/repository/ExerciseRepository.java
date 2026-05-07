package com.damier.damierclub.repository;

import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Exercise.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, UUID> {

    List<Exercise> findByStatusOrderByDifficultyAscPublishedAtDesc(Status status);

    Page<Exercise> findByStatus(Status status, Pageable pageable);

    long countByStatus(Status status);
}
