package com.damier.damierclub.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsDTO {
    private long totalClubs;
    private long totalMembers;
    private long totalPublishedArticles;
}
