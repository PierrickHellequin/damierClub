package com.damier.damierclub.controller;

import com.damier.damierclub.dto.MemberDTO;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.service.MemberService;
import com.damier.damierclub.mapper.MemberMapper;
import com.damier.damierclub.model.ClubRole;
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

    @GetMapping
    public List<MemberDTO> getAllMembers(@RequestParam(name = "page", required = false) Integer page,
                                        @RequestParam(name = "size", required = false) Integer size,
                                        @RequestParam(name = "sort", required = false) String sort,
                                        @RequestParam(name = "clubId", required = false) UUID clubId,
                                        @RequestParam(name = "search", required = false) String search,
                                        @RequestParam(name = "emailDomain", required = false) String emailDomain,
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

    @GetMapping("/{id}")
    public MemberDTO getMemberById(@PathVariable UUID id) {
        Member member = memberRepository.findById(id).orElse(null);
        return member != null ? memberMapper.toDTO(member) : null;
    }

    @PostMapping
    public MemberDTO createMember(@Valid @RequestBody MemberDTO memberDTO) {
        Member member = memberMapper.createEntityFromDTO(memberDTO);
        Member saved = memberService.create(member);
        return memberMapper.toDTO(saved);
    }

    @PutMapping("/{id}")
    public MemberDTO updateMember(@PathVariable UUID id, @RequestBody MemberDTO memberDTO) {
        return memberRepository.findById(id)
                .map(existing -> {
                    memberMapper.updateEntityFromDTO(memberDTO, existing);
                    Member updated = memberService.updateEntity(existing);
                    return memberMapper.toDTO(updated);
                })
                .orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteMember(@PathVariable UUID id) {
        memberRepository.deleteById(id);
    }

    /**
     * Endpoint pour récupérer les membres actifs seulement
     */
    @GetMapping("/active")
    public List<MemberDTO> getActiveMembers() {
        return memberService.findActiveMembers()
                .stream()
                .map(memberMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Endpoint pour récupérer les membres par club et rôle
     */
    @GetMapping("/by-club-role")
    public List<MemberDTO> getMembersByClubAndRole(@RequestParam UUID clubId, @RequestParam String role) {
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

    /**
     * Statistiques des membres par rôle dans un club
     */
    @GetMapping("/stats/roles/{clubId}")
    public Map<String, Long> getMemberRoleStats(@PathVariable UUID clubId) {
        return memberRepository.findByClub_Id(clubId)
                .stream()
                .filter(member -> member.getClubRole() != null)
                .collect(Collectors.groupingBy(
                    member -> member.getClubRole().getDisplayName(),
                    Collectors.counting()
                ));
    }

    /**
     * Vérifier si un email existe
     */
    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmailExists(@RequestParam String email) {
        return Map.of("exists", memberService.emailExists(email));
    }

    /**
     * Compter les membres par rôle dans un club
     */
    @GetMapping("/count-by-role")
    public Map<String, Long> countMembersByRole(@RequestParam UUID clubId, @RequestParam String role) {
        try {
            ClubRole clubRole = ClubRole.valueOf(role.toUpperCase());
            long count = memberService.countMembersByRole(clubId, clubRole);
            return Map.of("count", count);
        } catch (IllegalArgumentException e) {
            return Map.of("count", 0L); // Retourne 0 si le rôle n'existe pas
        }
    }
}