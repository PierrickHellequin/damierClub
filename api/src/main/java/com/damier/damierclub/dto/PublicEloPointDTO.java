package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/** A single point on a player's ELO curve. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicEloPointDTO {
    private LocalDateTime date;
    private Integer points;
    private Integer pointsChange;
    /** Optional context (typically the tournament name). */
    private String label;
}
