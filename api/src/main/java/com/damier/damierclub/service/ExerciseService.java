package com.damier.damierclub.service;

import com.damier.damierclub.dto.ExerciseDTO;
import com.damier.damierclub.dto.MovePairDTO;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Exercise.Status;
import com.damier.damierclub.repository.ExerciseRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ExerciseService {

    private static final int POSITION_LENGTH = 50;
    private static final TypeReference<List<MovePairDTO>> MOVE_LIST_TYPE =
        new TypeReference<List<MovePairDTO>>() {};

    private final ExerciseRepository exerciseRepository;
    private final ObjectMapper objectMapper;

    public ExerciseService(ExerciseRepository exerciseRepository, ObjectMapper objectMapper) {
        this.exerciseRepository = exerciseRepository;
        this.objectMapper = objectMapper;
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

    /** Parse the stored JSON into a typed list. Empty list when null/blank. */
    public List<MovePairDTO> readSolutionMoves(Exercise ex) {
        String json = ex.getSolutionMovesJson();
        if (json == null || json.isBlank()) return Collections.emptyList();
        try {
            return objectMapper.readValue(json, MOVE_LIST_TYPE);
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    /** Build the admin-facing DTO with the parsed solution moves. */
    public ExerciseDTO toDto(Exercise ex) {
        List<MovePairDTO> moves = readSolutionMoves(ex);
        return new ExerciseDTO(
            ex.getId(),
            ex.getTitle(),
            ex.getDescription(),
            ex.getPosition(),
            ex.getSideToPlay(),
            ex.getDifficulty(),
            ex.getSolution(),
            moves.isEmpty() ? null : moves,
            ex.getStatus(),
            ex.getPublishedAt(),
            ex.getCreatedAt(),
            ex.getUpdatedAt()
        );
    }

    private void applyFromDto(Exercise ex, ExerciseDTO dto) {
        ex.setTitle(dto.getTitle());
        ex.setDescription(dto.getDescription());
        ex.setPosition(dto.getPosition());
        ex.setSideToPlay(dto.getSideToPlay());
        ex.setDifficulty(dto.getDifficulty());
        ex.setSolution(dto.getSolution());
        ex.setSolutionMovesJson(serialiseMoves(dto.getSolutionMoves()));
        if (dto.getStatus() != null) ex.setStatus(dto.getStatus());
    }

    private String serialiseMoves(List<MovePairDTO> moves) {
        if (moves == null || moves.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(moves);
        } catch (Exception e) {
            throw new IllegalArgumentException("invalid solutionMoves payload");
        }
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
        if (dto.getSolutionMoves() != null) {
            for (int i = 0; i < dto.getSolutionMoves().size(); i++) {
                MovePairDTO mp = dto.getSolutionMoves().get(i);
                if (mp == null || mp.getFrom() == null || mp.getTo() == null) {
                    throw new IllegalArgumentException(
                        "solutionMoves[" + i + "] must have non-null from/to");
                }
                if (mp.getFrom() < 1 || mp.getFrom() > 50 || mp.getTo() < 1 || mp.getTo() > 50) {
                    throw new IllegalArgumentException(
                        "solutionMoves[" + i + "] must reference squares in 1..50");
                }
                if (mp.getFrom().equals(mp.getTo())) {
                    throw new IllegalArgumentException(
                        "solutionMoves[" + i + "] from must differ from to");
                }
            }
        }
    }
}
