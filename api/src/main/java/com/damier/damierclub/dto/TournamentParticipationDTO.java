package com.damier.damierclub.dto;

import com.damier.damierclub.model.TournamentCategory;
import com.damier.damierclub.model.TournamentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TournamentParticipationDTO {
    // Infos participation
    private UUID participationId;
    private String place;
    private Integer pointsChange;
    private Integer pointsAfter;
    private Integer victories;
    private Integer defeats;
    private Integer draws;

    // Infos tournoi
    private UUID tournamentId;
    private String tournamentName;
    private LocalDate tournamentDate;
    private TournamentType tournamentType;
    private TournamentCategory tournamentCategory;
    private String tournamentLocation;

    // Liste des parties avec adversaires et résultats
    private List<GameDTO> games;
}
