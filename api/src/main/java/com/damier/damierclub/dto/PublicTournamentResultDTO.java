package com.damier.damierclub.dto;

import com.damier.damierclub.model.TournamentCategory;
import com.damier.damierclub.model.TournamentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/** One row of a player's palmarès on the public site. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicTournamentResultDTO {
    private UUID tournamentId;
    private String tournamentName;
    private LocalDate tournamentDate;
    private TournamentType tournamentType;
    private TournamentCategory tournamentCategory;
    private String tournamentLocation;
    private String place;
    private Integer pointsChange;
    private Integer pointsAfter;
    private Integer victories;
    private Integer defeats;
    private Integer draws;
}
