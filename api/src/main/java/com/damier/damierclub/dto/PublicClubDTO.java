package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicClubDTO {
    private UUID id;
    private String name;
    private String city;
    private String address;
    private String website;
    private String logoUrl;
    private String description;
    private LocalDate creationDate;
    private String president;
    private String vicePresident;
    private String secretaire;
    private String tresorier;
    private Long membersCount;
}
