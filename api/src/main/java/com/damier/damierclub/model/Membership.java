package com.damier.damierclub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.damier.damierclub.util.UuidGenerator;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "memberships")
public class Membership {

    @Id
    @Column(columnDefinition = "uuid")
    private UUID id;

    // Relations
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    // Rôle dans ce club spécifique
    @Enumerated(EnumType.STRING)
    @Column(name = "club_role")
    private ClubRole clubRole = ClubRole.MEMBER;

    // Statut de l'adhésion
    @Enumerated(EnumType.STRING)
    private MembershipStatus status = MembershipStatus.ACTIVE;

    // Dates importantes
    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    // Informations spécifiques au club
    private String memberNumber; // numéro de licence dans ce club
    private Boolean receiveNotifications = true;

    @PrePersist
    public void generateId() {
        if (this.id == null) {
            this.id = UuidGenerator.generateUuidV7();
        }
        if (this.joinDate == null) {
            this.joinDate = LocalDate.now();
        }
    }

    // Enum pour les rôles dans un club
    public enum ClubRole {
        MEMBER("Membre"),
        TRAINER("Entraîneur"),
        ADMIN("Administrateur"),
        PRESIDENT("Président"),
        TREASURER("Trésorier"),
        SECRETARY("Secrétaire");

        private final String displayName;

        ClubRole(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    // Enum pour le statut de l'adhésion
    public enum MembershipStatus {
        ACTIVE("Actif"),
        INACTIVE("Inactif"),
        SUSPENDED("Suspendu"),
        PENDING("En attente");

        private final String displayName;

        MembershipStatus(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}