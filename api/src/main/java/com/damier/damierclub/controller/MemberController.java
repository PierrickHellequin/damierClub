package com.damier.damierclub.controller;

import com.damier.damierclub.dto.MemberDTO;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.service.MemberService;
import com.damier.damierclub.mapper.MemberMapper;
import com.damier.damierclub.model.ClubRole;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
@Tag(name = "Members", description = "Gestion des membres - CRUD complet, recherche et statistiques")
public class MemberController {

    private final MemberRepository memberRepository;
    private final MemberService memberService;
    private final ClubRepository clubRepository;
    private final MemberMapper memberMapper;

    public MemberController(MemberRepository memberRepository, MemberService memberService, 
                          ClubRepository clubRepository, MemberMapper memberMapper) {
        this.memberRepository = memberRepository;
        this.memberService = memberService;
        this.clubRepository = clubRepository;
        this.memberMapper = memberMapper;
    }

    @Operation(summary = "Récupérer tous les membres",
               description = "Récupère la liste de tous les membres avec pagination, tri et filtres optionnels")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des membres récupérée avec succès",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = MemberDTO.class)))
    })
    @GetMapping
    public List<MemberDTO> getAllMembers(
            @Parameter(description = "Numéro de page (pour pagination)") @RequestParam(name = "page", required = false) Integer page,
            @Parameter(description = "Taille de la page (pour pagination)") @RequestParam(name = "size", required = false) Integer size,
            @Parameter(description = "Champ de tri") @RequestParam(name = "sort", required = false) String sort,
            @Parameter(description = "Filtrer par ID de club") @RequestParam(name = "clubId", required = false) UUID clubId,
            @Parameter(description = "Recherche textuelle") @RequestParam(name = "search", required = false) String search,
            @Parameter(description = "Filtrer par domaine email") @RequestParam(name = "emailDomain", required = false) String emailDomain,
            HttpServletResponse response) {
        if (page != null && size != null) {
            Pageable pageable = (sort != null && !sort.isBlank()) ? 
                PageRequest.of(page, size, org.springframework.data.domain.Sort.by(sort)) : 
                PageRequest.of(page, size);
            Page<Member> p;
            if (clubId != null) {
                p = memberRepository.findByClub_Id(clubId, pageable);
            } else {
                p = memberRepository.findAll(pageable);
            }
            response.setHeader("X-Total-Count", String.valueOf(p.getTotalElements()));
            return p.getContent().stream().map(memberMapper::toDTO).collect(Collectors.toList());
        }
        
        // Utilisation de la nouvelle méthode avec critères multiples
        if (search != null || emailDomain != null || clubId != null) {
            return memberService.findMembersByCriteria(search, emailDomain, clubId)
                    .stream()
                    .map(memberMapper::toDTO)
                    .collect(Collectors.toList());
        }
        
        List<Member> members = memberRepository.findAll();
        return members.stream().map(memberMapper::toDTO).collect(Collectors.toList());
    }

    @Operation(summary = "Récupérer un membre par ID", description = "Récupère les détails d'un membre spécifique")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Membre trouvé"),
        @ApiResponse(responseCode = "404", description = "Membre non trouvé")
    })
    @GetMapping("/{id}")
    public MemberDTO getMemberById(@Parameter(description = "ID du membre") @PathVariable UUID id) {
        Member member = memberRepository.findById(id).orElse(null);
        return member != null ? memberMapper.toDTO(member) : null;
    }

    @Operation(summary = "Créer un nouveau membre", description = "Crée un nouveau membre dans la base de données")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Membre créé avec succès"),
        @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping
    public MemberDTO createMember(@Valid @RequestBody MemberDTO memberDTO) {
        Member member = memberMapper.createEntityFromDTO(memberDTO);
        Member saved = memberService.create(member);
        return memberMapper.toDTO(saved);
    }

    @Operation(summary = "Mettre à jour un membre", description = "Met à jour les informations d'un membre existant")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Membre mis à jour avec succès"),
        @ApiResponse(responseCode = "404", description = "Membre non trouvé")
    })
    @PutMapping("/{id}")
    public MemberDTO updateMember(@Parameter(description = "ID du membre") @PathVariable UUID id, @RequestBody MemberDTO memberDTO) {
        return memberRepository.findById(id)
                .map(existing -> {
                    memberMapper.updateEntityFromDTO(memberDTO, existing);
                    Member updated = memberService.updateEntity(existing);
                    return memberMapper.toDTO(updated);
                })
                .orElse(null);
    }

    @Operation(summary = "Supprimer un membre", description = "Supprime un membre de la base de données")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Membre supprimé avec succès"),
        @ApiResponse(responseCode = "404", description = "Membre non trouvé")
    })
    @DeleteMapping("/{id}")
    public void deleteMember(@Parameter(description = "ID du membre") @PathVariable UUID id) {
        memberRepository.deleteById(id);
    }

    @Operation(summary = "Récupérer les membres actifs", description = "Récupère uniquement les membres actifs")
    @ApiResponse(responseCode = "200", description = "Liste des membres actifs")
    @GetMapping("/active")
    public List<MemberDTO> getActiveMembers() {
        return memberService.findActiveMembers()
                .stream()
                .map(memberMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Operation(summary = "Récupérer les membres par club et rôle", description = "Filtre les membres par club et rôle spécifiques")
    @ApiResponse(responseCode = "200", description = "Liste des membres filtrés")
    @GetMapping("/by-club-role")
    public List<MemberDTO> getMembersByClubAndRole(
            @Parameter(description = "ID du club") @RequestParam UUID clubId,
            @Parameter(description = "Rôle (PRESIDENT, TREASURER, SECRETARY, MEMBER)") @RequestParam String role) {
        try {
            ClubRole clubRole = ClubRole.valueOf(role.toUpperCase());
            return memberService.findMembersByClubAndRole(clubId, clubRole)
                    .stream()
                    .map(memberMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            return List.of(); // Retourne une liste vide si le rôle n'existe pas
        }
    }

    @Operation(summary = "Statistiques des rôles", description = "Récupère les statistiques de répartition des rôles dans un club")
    @ApiResponse(responseCode = "200", description = "Map des rôles avec leur nombre de membres")
    @GetMapping("/stats/roles/{clubId}")
    public Map<String, Long> getMemberRoleStats(@Parameter(description = "ID du club") @PathVariable UUID clubId) {
        return memberRepository.findByClub_Id(clubId)
                .stream()
                .filter(member -> member.getClubRole() != null)
                .collect(Collectors.groupingBy(
                    member -> member.getClubRole().getDisplayName(),
                    Collectors.counting()
                ));
    }

    @Operation(summary = "Vérifier l'existence d'un email", description = "Vérifie si un email existe déjà dans la base")
    @ApiResponse(responseCode = "200", description = "Résultat de la vérification")
    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmailExists(@Parameter(description = "Email à vérifier") @RequestParam String email) {
        return Map.of("exists", memberService.emailExists(email));
    }

    @Operation(summary = "Compter les membres par rôle", description = "Compte le nombre de membres ayant un rôle spécifique dans un club")
    @ApiResponse(responseCode = "200", description = "Nombre de membres avec ce rôle")
    @GetMapping("/count-by-role")
    public Map<String, Long> countMembersByRole(
            @Parameter(description = "ID du club") @RequestParam UUID clubId,
            @Parameter(description = "Rôle à compter") @RequestParam String role) {
        try {
            ClubRole clubRole = ClubRole.valueOf(role.toUpperCase());
            long count = memberService.countMembersByRole(clubId, clubRole);
            return Map.of("count", count);
        } catch (IllegalArgumentException e) {
            return Map.of("count", 0L); // Retourne 0 si le rôle n'existe pas
        }
    }
}