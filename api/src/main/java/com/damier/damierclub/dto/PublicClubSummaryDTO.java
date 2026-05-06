package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicClubSummaryDTO {
    private UUID id;
    private String name;
    private String city;
    private String logoUrl;
    private Long membersCount;
}
