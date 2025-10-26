package com.damier.damierclub.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "points_history")
public class PointsHistory {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    // Relation ManyToOne : un historique concerne un membre
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @NotNull
    private Member member;

    // Relation optionnelle : changement lié à un tournoi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    // Détails du changement
    @NotNull
    private Integer pointsBefore; // Points avant le changement
    @NotNull
    private Integer pointsAfter; // Points après le changement
    @NotNull
    private Integer pointsChange; // Changement (positif ou négatif)

    private String reason; // Raison du changement (ex: "Victoire tournoi", "Ajustement manuel")

    @NotNull
    private LocalDateTime changedAt; // Date et heure du changement

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
        if (this.changedAt == null) {
            this.changedAt = LocalDateTime.now();
        }
    }
}
