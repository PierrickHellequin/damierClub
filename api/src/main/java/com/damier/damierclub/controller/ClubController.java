package com.damier.damierclub.controller;

import com.damier.damierclub.dto.ClubStatsDTO;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.ClubRole;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.service.AuthorizationService;
import com.damier.damierclub.service.ClubService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final MemberRepository memberRepository;
    private final AuthorizationService authorizationService;
    private final ClubService clubService;

    public ClubController(ClubRepository clubRepository, MemberRepository memberRepository,
                         AuthorizationService authorizationService, ClubService clubService) {
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
        this.authorizationService = authorizationService;
        this.clubService = clubService;
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
    public ResponseEntity<Club> createClub(
            @Valid @RequestBody Club club,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Check authorization manually
        if (!authorizationService.isSuperAdmin(userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(clubRepository.save(club));
    }

    @Operation(summary = "Mettre à jour un club", description = "Met à jour les informations d'un club existant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Club mis à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé"),
        @ApiResponse(responseCode = "403", description = "Non autorisé")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Club> updateClub(
            @Parameter(description = "ID du club") @PathVariable UUID id,
            @RequestBody Club clubDetails,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Check authorization manually
        if (!authorizationService.canModifyClub(userEmail, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return clubRepository.findById(id)
                .map(club -> {
                    // Utilisation d'Optional pour une gestion plus élégante des champs null
                    Optional.ofNullable(clubDetails.getName()).ifPresent(club::setName);
                    Optional.ofNullable(clubDetails.getEmail()).ifPresent(club::setEmail);
                    Optional.ofNullable(clubDetails.getPhone()).ifPresent(club::setPhone);
                    Optional.ofNullable(clubDetails.getAddress()).ifPresent(club::setAddress);
                    Optional.ofNullable(clubDetails.getCity()).ifPresent(club::setCity);
                    Optional.ofNullable(clubDetails.getWebsite()).ifPresent(club::setWebsite);
                    Optional.ofNullable(clubDetails.getDescription()).ifPresent(club::setDescription);
                    Optional.ofNullable(clubDetails.getLogoUrl()).ifPresent(club::setLogoUrl);
                    Optional.ofNullable(clubDetails.getCreationDate()).ifPresent(club::setCreationDate);
                    Optional.ofNullable(clubDetails.getStatus()).ifPresent(club::setStatus);
                    Optional.ofNullable(clubDetails.getPresident()).ifPresent(club::setPresident);
                    Optional.ofNullable(clubDetails.getVicePresident()).ifPresent(club::setVicePresident);
                    Optional.ofNullable(clubDetails.getTresorier()).ifPresent(club::setTresorier);
                    Optional.ofNullable(clubDetails.getSecretaire()).ifPresent(club::setSecretaire);
                    return clubRepository.save(club);
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Supprimer un club", description = "Supprime un club de la base de données")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Club supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé"),
        @ApiResponse(responseCode = "403", description = "Non autorisé")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClub(
            @Parameter(description = "ID du club") @PathVariable UUID id,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Check authorization manually
        if (!authorizationService.isSuperAdmin(userEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        clubRepository.deleteById(id);
        return ResponseEntity.noContent().build();
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

    @Operation(summary = "Ajouter un membre à un club", description = "Ajoute un membre au club avec un rôle spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Membre ajouté au club avec succès"),
        @ApiResponse(responseCode = "404", description = "Membre ou club non trouvé"),
        @ApiResponse(responseCode = "403", description = "Non autorisé")
    })
    @PostMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<Member> addMemberToClub(
            @Parameter(description = "ID du club") @PathVariable UUID clubId,
            @Parameter(description = "ID du membre") @PathVariable UUID memberId,
            @Parameter(description = "Rôle du membre (PRESIDENT, TRESORIER, SECRETAIRE, MEMBRE)") @RequestParam String role,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Vérifier si l'utilisateur peut gérer les membres du club
        if (!authorizationService.canManageClubMembers(userEmail, clubId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Club> club = clubRepository.findById(clubId);
        Optional<Member> memberOpt = memberRepository.findById(memberId);

        if (club.isEmpty() || memberOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Member member = memberOpt.get();
        try {
            ClubRole clubRole = ClubRole.valueOf(role.toUpperCase());
            member.setClub(club.get());
            member.setClubRole(clubRole);
            Member updatedMember = memberRepository.save(member);
            return ResponseEntity.ok(updatedMember);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Retirer un membre du club", description = "Retire un membre d'un club")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Membre retiré du club avec succès"),
        @ApiResponse(responseCode = "404", description = "Membre ou club non trouvé"),
        @ApiResponse(responseCode = "403", description = "Non autorisé")
    })
    @DeleteMapping("/{clubId}/members/{memberId}")
    public ResponseEntity<Void> removeMemberFromClub(
            @Parameter(description = "ID du club") @PathVariable UUID clubId,
            @Parameter(description = "ID du membre") @PathVariable UUID memberId,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Vérifier si l'utilisateur peut gérer les membres du club
        if (!authorizationService.canManageClubMembers(userEmail, clubId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Member> memberOpt = memberRepository.findById(memberId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Member member = memberOpt.get();
        member.setClub(null);
        member.setClubRole(null);
        memberRepository.save(member);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Changer le rôle d'un membre dans le club", description = "Change le rôle d'un membre au sein du club")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Rôle du membre modifié avec succès"),
        @ApiResponse(responseCode = "404", description = "Membre non trouvé"),
        @ApiResponse(responseCode = "403", description = "Non autorisé")
    })
    @PatchMapping("/{clubId}/members/{memberId}/role")
    public ResponseEntity<Member> changeMemberRole(
            @Parameter(description = "ID du club") @PathVariable UUID clubId,
            @Parameter(description = "ID du membre") @PathVariable UUID memberId,
            @Parameter(description = "Nouveau rôle du membre") @RequestParam String role,
            @Parameter(description = "Email de l'utilisateur", required = true) @RequestHeader("X-User-Email") String userEmail) {
        // Vérifier si l'utilisateur peut gérer les membres du club
        if (!authorizationService.canManageClubMembers(userEmail, clubId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Member> memberOpt = memberRepository.findById(memberId);
        if (memberOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Member member = memberOpt.get();
        try {
            ClubRole clubRole = ClubRole.valueOf(role.toUpperCase());
            member.setClubRole(clubRole);
            Member updatedMember = memberRepository.save(member);
            return ResponseEntity.ok(updatedMember);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(summary = "Récupérer les membres d'un club", description = "Récupère tous les membres d'un club spécifique")
    @ApiResponse(responseCode = "200", description = "Liste des membres du club")
    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<Member>> getClubMembers(
            @Parameter(description = "ID du club") @PathVariable UUID clubId) {
        Optional<Club> club = clubRepository.findById(clubId);
        if (club.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Member> members = memberRepository.findByClub_Id(clubId);
        return ResponseEntity.ok(members);
    }

    @Operation(summary = "Récupérer les statistiques d'un club", description = "Récupère les statistiques détaillées d'un club (membres, points, victoires)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Statistiques du club récupérées"),
        @ApiResponse(responseCode = "404", description = "Club non trouvé")
    })
    @GetMapping("/{clubId}/stats")
    public ResponseEntity<ClubStatsDTO> getClubStats(
            @Parameter(description = "ID du club") @PathVariable UUID clubId) {
        try {
            ClubStatsDTO stats = clubService.getClubStats(clubId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}