package com.damier.damierclub.controller;

import com.damier.damierclub.model.Club;
import com.damier.damierclub.repository.ClubRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
@Tag(name = "Clubs", description = "Gestion des clubs - CRUD complet, recherche par ville et statistiques")
public class ClubController {

    private final ClubRepository clubRepository;

    public ClubController(ClubRepository clubRepository) {
        this.clubRepository = clubRepository;
    }

    @Operation(summary = "Récupérer tous les clubs", description = "Récupère tous les clubs avec filtres optionnels par recherche textuelle et ville")
    @ApiResponse(responseCode = "200", description = "Liste des clubs récupérée avec succès")
    @GetMapping
    public List<Club> getAllClubs(
            @Parameter(description = "Recherche textuelle dans nom et description") @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filtrer par ville") @RequestParam(name = "city", required = false) String city) {
        List<Club> clubs = clubRepository.findAll();

        return clubs.stream()
                .filter(club -> search == null ||
                    club.getName().toLowerCase().contains(search.toLowerCase()) ||
                    (club.getDescription() != null && club.getDescription().toLowerCase().contains(search.toLowerCase())))
                .filter(club -> city == null ||
                    (club.getCity() != null && club.getCity().equalsIgnoreCase(city)))
                .collect(Collectors.toList());
    }

    @Operation(summary = "Récupérer un club par ID", description = "Récupère les détails d'un club spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Club trouvé"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé")
    })
    @GetMapping("/{id}")
    public Club getClubById(@Parameter(description = "ID du club") @PathVariable UUID id) {
        return clubRepository.findById(id).orElse(null);
    }

    @Operation(summary = "Créer un nouveau club", description = "Crée un nouveau club dans la base de données")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Club créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping
    public Club createClub(@Valid @RequestBody Club club) {
        return clubRepository.save(club);
    }

    @Operation(summary = "Mettre à jour un club", description = "Met à jour les informations d'un club existant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Club mis à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé")
    })
    @PutMapping("/{id}")
    public Club updateClub(@Parameter(description = "ID du club") @PathVariable UUID id, @RequestBody Club clubDetails) {
        return clubRepository.findById(id)
                .map(club -> {
                    // Utilisation d'Optional pour une gestion plus élégante des champs null
                    Optional.ofNullable(clubDetails.getName()).ifPresent(club::setName);
                    Optional.ofNullable(clubDetails.getEmail()).ifPresent(club::setEmail);
                    Optional.ofNullable(clubDetails.getPhone()).ifPresent(club::setPhone);
                    Optional.ofNullable(clubDetails.getAddress()).ifPresent(club::setAddress);
                    Optional.ofNullable(clubDetails.getCity()).ifPresent(club::setCity);
                    Optional.ofNullable(clubDetails.getDescription()).ifPresent(club::setDescription);
                    Optional.ofNullable(clubDetails.getLogoUrl()).ifPresent(club::setLogoUrl);
                    Optional.ofNullable(clubDetails.getCreationDate()).ifPresent(club::setCreationDate);
                    return clubRepository.save(club);
                })
                .orElse(null);
    }

    @Operation(summary = "Supprimer un club", description = "Supprime un club de la base de données")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Club supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé")
    })
    @DeleteMapping("/{id}")
    public void deleteClub(@Parameter(description = "ID du club") @PathVariable UUID id) {
        clubRepository.deleteById(id);
    }

    @Operation(summary = "Rechercher les clubs par ville", description = "Récupère tous les clubs d'une ville spécifique")
    @ApiResponse(responseCode = "200", description = "Liste des clubs de cette ville")
    @GetMapping("/by-city/{city}")
    public List<Club> getClubsByCity(@Parameter(description = "Nom de la ville") @PathVariable String city) {
        return clubRepository.findAll()
                .stream()
                .filter(club -> club.getCity() != null && club.getCity().equalsIgnoreCase(city))
                .collect(Collectors.toList());
    }

    @Operation(summary = "Statistiques des clubs par ville", description = "Récupère le nombre de clubs par ville sous forme de liste formatée")
    @ApiResponse(responseCode = "200", description = "Statistiques des clubs par ville")
    @GetMapping("/stats/by-city")
    public List<String> getClubStatsByCity() {
        return clubRepository.findAll()
                .stream()
                .filter(club -> club.getCity() != null)
                .collect(Collectors.groupingBy(
                    club -> club.getCity(),
                    Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> entry.getKey() + ": " + entry.getValue() + " club(s)")
                .sorted()
                .collect(Collectors.toList());
    }
}