package com.damier.damierclub.dto;

import com.damier.damierclub.model.ClubRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Detailed public profile of a player. The omitted fields (email, phone,
 * address, rate, licenceNumber, password) MUST NEVER appear on this page.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicPlayerDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String city;
    private Integer currentPoints;
    private Integer ranking;
    private String ffjdId;
    private LocalDate registrationDate;
    private ClubRole clubRole;
    private UUID clubId;
    private String clubName;

    /** Aggregates derived from tournament participations. */
    private Long totalTournaments;
    private Long totalVictories;
    private Long totalDefeats;
    private Long totalDraws;
    private Double winRate;
    private Integer highestPoints;
    private Integer lowestPoints;
}
