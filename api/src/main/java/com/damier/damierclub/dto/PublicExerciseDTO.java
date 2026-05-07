package com.damier.damierclub.dto;

import com.damier.damierclub.model.Exercise.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicExerciseDTO {
    private String id;
    private String title;
    private String description;
    private String position;
    /** Lowercase to match the front type ("white" | "black"). */
    private String sideToPlay;
    private Difficulty difficulty;
    private String solution;
    private LocalDateTime publishedAt;
}
