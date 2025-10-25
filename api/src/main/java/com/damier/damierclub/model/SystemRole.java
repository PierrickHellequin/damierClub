package com.damier.damierclub.model;

/**
 * Système de rôles global pour l'application
 * Un utilisateur ne peut avoir qu'UN rôle système à la fois
 */
public enum SystemRole {
    ROLE_SUPER_ADMIN("Super Administrateur - Tous les droits sur toute l'application"),
    ROLE_PRESIDENT("Président - Gère son club et ses membres"),
    ROLE_MEMBER("Membre - Accès standard aux fonctionnalités");

    private final String description;

    SystemRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Retourne le rôle à partir d'une chaîne (ex: "ROLE_SUPER_ADMIN" -> ROLE_SUPER_ADMIN)
     */
    public static SystemRole fromString(String value) {
        if (value == null) return ROLE_MEMBER; // Par défaut
        try {
            return SystemRole.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ROLE_MEMBER;
        }
    }

    /**
     * Vérifie si ce rôle a au moins le même niveau de permission qu'un autre
     */
    public boolean isAtLeast(SystemRole other) {
        if (other == null) return false;
        return this.ordinal() <= other.ordinal();
    }
}
