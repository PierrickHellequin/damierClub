package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.damier.damierclub.util.UuidGenerator;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "members")
public class Member {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @NotBlank
    private String name; // pseudo
    @Email
    @Column(unique = true)
    private String email;
    private String phone;
    private String address;
    private String city;
    private int rate;
    @JsonIgnore
    private String password;

    // Champs profil
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String gender;
    private Boolean active = true;

    // Champs supplémentaires pour le profil complet
    private LocalDate registrationDate; // Date d'inscription
    private Integer currentPoints = 0; // Capital points actuel
    private String licenceNumber; // Numéro de licence

    // Relation ManyToOne : un membre appartient à un club
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id")
    private Club club;

    // Rôle du membre dans le club (ex: PRESIDENT, SECRETAIRE, TRESORIER, MEMBRE)
    @Enumerated(EnumType.STRING)
    private ClubRole clubRole = ClubRole.MEMBRE;

    // Rôle système (ex: ADMIN, USER)
    private String role = "ROLE_USER";

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
    }
}
