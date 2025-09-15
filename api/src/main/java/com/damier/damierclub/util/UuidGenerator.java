package com.damier.damierclub.util;

import com.github.f4b6a3.uuid.UuidCreator;
import java.util.UUID;

/**
 * Utilitaire pour générer des UUID v7
 * Les UUID v7 sont ordonnés dans le temps et optimisés pour les bases de données
 */
public class UuidGenerator {
    
    /**
     * Génère un UUID v7 ordonné dans le temps
     * @return UUID v7
     */
    public static UUID generateUuidV7() {
        return UuidCreator.getTimeOrderedEpoch();
    }
}