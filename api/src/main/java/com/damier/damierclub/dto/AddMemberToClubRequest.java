package com.damier.damierclub.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class AddMemberToClubRequest {
    private String email; // Email du membre à ajouter
    private UUID clubId; // ID du club
    private String clubRole; // Rôle du membre dans le club (PRESIDENT, TRESORIER, SECRETAIRE, MEMBRE)
}
