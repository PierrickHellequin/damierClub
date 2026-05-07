package com.damier.damierclub.dto;

import com.damier.damierclub.model.Exercise.Difficulty;
import com.damier.damierclub.model.Exercise.Side;
import com.damier.damierclub.model.Exercise.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/** Full DTO used by the BO admin endpoints. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private UUID id;
    private String title;
    private String description;
    private String position;
    private Side sideToPlay;
    private Difficulty difficulty;
    private String solution;
    private Status status;
    private LocalDateTime publishedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
