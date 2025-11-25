package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClubStatsDTO {
    private Long totalMembers;
    private Integer averagePoints;
    private Integer highestPoints;
    private String topPlayerName;
    private Long totalVictories;
    private Double victoryRatio;
}
