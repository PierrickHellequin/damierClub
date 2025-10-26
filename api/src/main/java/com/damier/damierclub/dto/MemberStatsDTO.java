package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MemberStatsDTO {
    private Long totalTournaments;     // Nombre total de tournois
    private Long totalVictories;       // Nombre total de victoires
    private Long totalDefeats;         // Nombre total de défaites
    private Long totalDraws;           // Nombre total de nuls
    private Double winRate;            // Taux de victoire (%)
    private Integer currentPoints;     // Points actuels
    private Integer highestPoints;     // Points max atteints
    private Integer lowestPoints;      // Points min atteints
}
