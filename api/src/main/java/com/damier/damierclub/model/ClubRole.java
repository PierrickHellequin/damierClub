package com.damier.damierclub.model;

public enum ClubRole {
    PRESIDENT("Président"),
    VICE_PRESIDENT("Vice-Président"),
    SECRETAIRE("Secrétaire"),
    TRESORIER("Trésorier"),
    MEMBRE("Membre"),
    ENTRAINEUR("Entraîneur"),
    ARBITRE("Arbitre");

    private final String displayName;

    ClubRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}