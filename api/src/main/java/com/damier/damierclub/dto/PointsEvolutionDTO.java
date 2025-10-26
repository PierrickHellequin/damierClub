package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PointsEvolutionDTO {
    private LocalDateTime date;
    private Integer points;
    private Integer pointsChange;
    private String reason;           // Raison (ex: "Open Paris", "Ajustement manuel")
    private UUID tournamentId;       // ID du tournoi (si lié à un tournoi)
    private String tournamentName;   // Nom du tournoi (si lié à un tournoi)
}
