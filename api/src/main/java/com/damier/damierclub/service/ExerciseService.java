package com.damier.damierclub.service;

import com.damier.damierclub.dto.ExerciseDTO;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Exercise.Status;
import com.damier.damierclub.repository.ExerciseRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ExerciseService {

    private static final int POSITION_LENGTH = 50;

    private final ExerciseRepository exerciseRepository;

    public ExerciseService(ExerciseRepository exerciseRepository) {
        this.exerciseRepository = exerciseRepository;
    }

    public Page<Exercise> list(int page, int size, Status status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        if (status != null) {
            return exerciseRepository.findByStatus(status, pageable);
        }
        return exerciseRepository.findAll(pageable);
    }

    public Exercise get(UUID id) {
        return exerciseRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + id));
    }

    public Exercise create(ExerciseDTO dto) {
        validate(dto);
        Exercise ex = new Exercise();
        applyFromDto(ex, dto);
        return exerciseRepository.save(ex);
    }

    public Exercise update(UUID id, ExerciseDTO dto) {
        validate(dto);
        Exercise ex = get(id);
        applyFromDto(ex, dto);
        return exerciseRepository.save(ex);
    }

    public Exercise publish(UUID id) {
        Exercise ex = get(id);
        ex.setStatus(Status.PUBLISHED);
        if (ex.getPublishedAt() == null) ex.setPublishedAt(LocalDateTime.now());
        return exerciseRepository.save(ex);
    }

    public Exercise unpublish(UUID id) {
        Exercise ex = get(id);
        ex.setStatus(Status.DRAFT);
        return exerciseRepository.save(ex);
    }

    public Exercise archive(UUID id) {
        Exercise ex = get(id);
        ex.setStatus(Status.ARCHIVED);
        return exerciseRepository.save(ex);
    }

    public void delete(UUID id) {
        exerciseRepository.deleteById(id);
    }

    private void applyFromDto(Exercise ex, ExerciseDTO dto) {
        ex.setTitle(dto.getTitle());
        ex.setDescription(dto.getDescription());
        ex.setPosition(dto.getPosition());
        ex.setSideToPlay(dto.getSideToPlay());
        ex.setDifficulty(dto.getDifficulty());
        ex.setSolution(dto.getSolution());
        if (dto.getStatus() != null) ex.setStatus(dto.getStatus());
    }

    private void validate(ExerciseDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        if (dto.getPosition() == null || dto.getPosition().length() != POSITION_LENGTH) {
            throw new IllegalArgumentException(
                "position must be a 50-character encoded board");
        }
        for (int i = 0; i < POSITION_LENGTH; i++) {
            char ch = dto.getPosition().charAt(i);
            if (ch != '.' && ch != 'w' && ch != 'W' && ch != 'b' && ch != 'B') {
                throw new IllegalArgumentException(
                    "invalid character in position at index " + i + ": '" + ch + "'");
            }
        }
        if (dto.getSideToPlay() == null) {
            throw new IllegalArgumentException("sideToPlay is required");
        }
        if (dto.getDifficulty() == null) {
            throw new IllegalArgumentException("difficulty is required");
        }
    }
}
