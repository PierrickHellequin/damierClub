package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/** Listing/summary view of a player on the public site. No private fields. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicPlayerSummaryDTO {
    private UUID id;
    private String firstName;
    private String lastName;
    private String city;
    private Integer currentPoints;
    private Integer ranking;
    private String ffjdId;
    private UUID clubId;
    private String clubName;
}
