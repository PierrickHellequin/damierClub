package com.damier.damierclub.service;

import com.damier.damierclub.model.ClubRole;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.SystemRole;
import com.damier.damierclub.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service pour vérifier les permissions et autorisations
 */
@Service
@RequiredArgsConstructor
public class AuthorizationService {

    private final MemberRepository memberRepository;

    /**
     * Vérifie si l'utilisateur est Super Admin
     */
    public boolean isSuperAdmin(String email) {
        return memberRepository.findByEmail(email)
                .map(m -> isSuperAdmin(m))
                .orElse(false);
    }

    /**
     * Vérifie si le membre est Super Admin
     */
    public boolean isSuperAdmin(Member member) {
        return member != null && member.getRole() != null &&
                member.getRole().toUpperCase().contains("SUPER_ADMIN");
    }

    /**
     * Vérifie si l'utilisateur est Président du club spécifié
     */
    public boolean isPresidentOfClub(String email, UUID clubId) {
        return memberRepository.findByEmail(email)
                .map(m -> isPresidentOfClub(m, clubId))
                .orElse(false);
    }

    /**
     * Vérifie si le membre est Président du club spécifié
     */
    public boolean isPresidentOfClub(Member member, UUID clubId) {
        return isSuperAdmin(member) || (
                member != null &&
                member.getClub() != null &&
                member.getClub().getId().equals(clubId) &&
                member.getClubRole() != null &&
                "PRESIDENT".equalsIgnoreCase(member.getClubRole().name())
        );
    }

    /**
     * Vérifie si l'utilisateur peut modifier le club (President, Trésorier, Secrétaire ou Super Admin)
     */
    public boolean canModifyClub(String email, UUID clubId) {
        return memberRepository.findByEmail(email)
                .map(m -> canModifyClub(m, clubId))
                .orElse(false);
    }

    /**
     * Vérifie si le membre peut modifier le club
     */
    public boolean canModifyClub(Member member, UUID clubId) {
        if (isSuperAdmin(member)) return true;

        if (member == null || member.getClub() == null || !member.getClub().getId().equals(clubId)) {
            return false;
        }

        ClubRole role = member.getClubRole();
        return role != null && (
               "PRESIDENT".equalsIgnoreCase(role.name()) ||
               "TRESORIER".equalsIgnoreCase(role.name()) ||
               "SECRETAIRE".equalsIgnoreCase(role.name())
        );
    }

    /**
     * Vérifie si l'utilisateur appartient au club
     */
    public boolean belongsToClub(String email, UUID clubId) {
        return memberRepository.findByEmail(email)
                .map(m -> belongsToClub(m, clubId))
                .orElse(false);
    }

    /**
     * Vérifie si le membre appartient au club
     */
    public boolean belongsToClub(Member member, UUID clubId) {
        return isSuperAdmin(member) || (
                member != null &&
                member.getClub() != null &&
                member.getClub().getId().equals(clubId)
        );
    }

    /**
     * Vérifie si l'utilisateur peut ajouter des membres au club
     */
    public boolean canManageClubMembers(String email, UUID clubId) {
        return canModifyClub(email, clubId); // Même permission que modifier le club
    }

    /**
     * Vérifie si l'utilisateur peut modifier un membre spécifique
     */
    public boolean canModifyMember(String email, UUID targetMemberId) {
        var requester = memberRepository.findByEmail(email);
        var target = memberRepository.findById(targetMemberId);

        if (requester.isEmpty() || target.isEmpty()) return false;

        Member requesterMember = requester.get();
        Member targetMember = target.get();

        // Super admin peut tout faire
        if (isSuperAdmin(requesterMember)) return true;

        // Un utilisateur peut modifier son propre profil
        if (requesterMember.getId().equals(targetMember.getId())) return true;

        // Les responsables du club peuvent modifier les membres du même club
        return canModifyClub(requesterMember, targetMember.getClub().getId());
    }
}
