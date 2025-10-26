package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tournament_participations")
public class TournamentParticipation {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    // Relation ManyToOne : une participation concerne un membre
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @NotNull
    private Member member;

    // Relation ManyToOne : une participation concerne un tournoi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    @NotNull
    private Tournament tournament;

    // Résultats de la participation
    private String place; // Classement (ex: "5ème", "1er")
    private Integer pointsChange; // Points gagnés ou perdus (ex: -40, +60)
    private Integer pointsAfter; // Points du membre après le tournoi
    private Integer victories = 0; // Nombre de victoires
    private Integer defeats = 0; // Nombre de défaites
    private Integer draws = 0; // Nombre de nuls

    // Relation inverse: parties jouées dans ce tournoi
    @OneToMany(mappedBy = "participation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Game> games = new ArrayList<>();

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
    }
}
