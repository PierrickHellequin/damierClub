package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tournaments")
public class Tournament {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    @NotBlank
    private String name; // Nom du tournoi (ex: "Open International Paris")

    @NotNull
    private LocalDate startDate; // Date de début

    private LocalDate endDate; // Date de fin (optionnel)

    @Enumerated(EnumType.STRING)
    @NotNull
    private TournamentType type = TournamentType.TOURNOI; // Type de tournoi

    @Enumerated(EnumType.STRING)
    @NotNull
    private TournamentCategory category = TournamentCategory.OPEN; // Catégorie

    private String location; // Lieu (ville)

    private String description; // Description

    private Boolean active = true; // Tournoi actif ou archivé

    // Relation inverse: participations au tournoi
    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TournamentParticipation> participations = new ArrayList<>();

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
    }
}
