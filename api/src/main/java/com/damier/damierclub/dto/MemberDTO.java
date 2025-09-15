package com.damier.damierclub.dto;

import com.damier.damierclub.model.ClubRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class MemberDTO {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String city;
    private Integer rate;
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String gender;
    private Boolean active;
    private ClubRole clubRole;
    private String role;
    private String password; // Pour création/modification
    
    // Club relation
    @JsonProperty("club")
    private ClubReference club;
    
    // Champ pour affichage côté frontend
    private String clubName;
    
    @Data
    public static class ClubReference {
        private UUID id;
    }
    
    // Getter pour compatibilité avec le frontend
    @JsonProperty("clubId")
    public UUID getClubId() {
        return club != null ? club.getId() : null;
    }
}