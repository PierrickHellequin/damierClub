package com.damier.damierclub.service;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.ClubRole;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.ClubRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.Optional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final ClubRepository clubRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberService(MemberRepository memberRepository, ClubRepository clubRepository, PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.clubRepository = clubRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private String slugify(String value) {
        return Optional.ofNullable(value)
                .map(String::trim)
                .map(String::toLowerCase)
                .map(s -> s.replaceAll("[^a-z0-9]+", "-"))
                .map(s -> s.replaceAll("^-+|-+$", ""))
                .filter(s -> !s.isBlank())
                .orElse(null);
    }

    private String generatePseudo(Member m) {
        String base = Optional.ofNullable(m.getFirstName()).orElse("") + "-" + 
                     Optional.ofNullable(m.getLastName()).orElse("");
        base = base.replaceAll("[-_]+", "-");
        String slug = slugify(base);
        return Optional.ofNullable(slug)
                .orElse("user" + System.currentTimeMillis());
    }

    public Member register(String name, String email, String rawPassword) {
        Member m = new Member();
        m.setName(name);
        m.setEmail(email);
        m.setPassword(passwordEncoder.encode(rawPassword));
        return memberRepository.save(m);
    }

    public Optional<Member> findByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public boolean verifyPassword(Member member, String rawPassword) {
        return passwordEncoder.matches(rawPassword, member.getPassword());
    }

    public Member create(Member member) {
        if (member.getPassword() != null && !member.getPassword().isBlank()) {
            member.setPassword(passwordEncoder.encode(member.getPassword()));
        }
        if (member.getName() == null || member.getName().isBlank()) {
            member.setName(generatePseudo(member));
        }
        // Associer au club si clubId fourni
        if (member.getClub() != null && member.getClub().getId() != null) {
            Club club = clubRepository.findById(member.getClub().getId()).orElse(null);
            member.setClub(club);
        }
        return memberRepository.save(member);
    }

    public Optional<Member> authenticate(String email, String rawPassword) {
        return findByEmail(email)
                .filter(m -> verifyPassword(m, rawPassword));
    }

    public Member update(Member existing, Member incoming) {
        existing.setName((incoming.getName() == null || incoming.getName().isBlank()) ? existing.getName() : incoming.getName());
        existing.setEmail(incoming.getEmail());
        existing.setPhone(incoming.getPhone());
        existing.setAddress(incoming.getAddress());
        existing.setCity(incoming.getCity());
        existing.setRate(incoming.getRate());
        existing.setFirstName(incoming.getFirstName());
        existing.setLastName(incoming.getLastName());
        existing.setBirthDate(incoming.getBirthDate());
        existing.setGender(incoming.getGender());
        existing.setActive(incoming.getActive());
        
        // Gestion du changement de club - CORRECTION
        if (incoming.getClub() != null) {
            if (incoming.getClub().getId() != null) {
                // Assigner à un nouveau club
                Club club = clubRepository.findById(incoming.getClub().getId()).orElse(null);
                if (club != null) {
                    existing.setClub(club);
                    // Conserver le rôle seulement si un club est assigné
                    existing.setClubRole(incoming.getClubRole());
                    System.out.println("Assigning member to club ID: " + incoming.getClub().getId() + " with role: " + incoming.getClubRole());
                } else {
                    existing.setClub(null);
                    existing.setClubRole(null);
                    System.out.println("Club not found, removing assignment");
                }
            } else {
                // Club avec ID null = supprimer l'assignation
                existing.setClub(null);
                existing.setClubRole(null);
                System.out.println("Removing club assignment");
            }
        } else {
            // Club null = supprimer l'assignation ET le rôle
            existing.setClub(null);
            existing.setClubRole(null);
            System.out.println("Removing club assignment (club is null)");
        }
        
        if (incoming.getPassword() != null && !incoming.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(incoming.getPassword()));
        }
        if (existing.getName() == null || existing.getName().isBlank()) {
            existing.setName(generatePseudo(existing));
        }
        
        Member saved = memberRepository.save(existing);
        System.out.println("Member saved with club ID: " + (saved.getClub() != null ? saved.getClub().getId() : "null") + " and role: " + saved.getClubRole());
        return saved;
    }

    public Member updateEntity(Member member) {
        return memberRepository.save(member);
    }

    /**
     * Trouve tous les membres d'un club spécifique avec un rôle donné
     */
    public List<Member> findMembersByClubAndRole(UUID clubId, ClubRole role) {
        return memberRepository.findByClub_Id(clubId)
                .stream()
                .filter(member -> role.equals(member.getClubRole()))
                .collect(Collectors.toList());
    }

    /**
     * Trouve tous les membres actifs (avec un club assigné)
     */
    public List<Member> findActiveMembers() {
        return memberRepository.findAll()
                .stream()
                .filter(member -> member.getClub() != null)
                .collect(Collectors.toList());
    }

    /**
     * Trouve les membres par critères multiples avec Streams
     */
    public List<Member> findMembersByCriteria(String nameFilter, String emailDomain, UUID clubId) {
        return memberRepository.findAll()
                .stream()
                .filter(member -> nameFilter == null || 
                    member.getName().toLowerCase().contains(nameFilter.toLowerCase()))
                .filter(member -> emailDomain == null || 
                    member.getEmail().toLowerCase().endsWith("@" + emailDomain.toLowerCase()))
                .filter(member -> clubId == null || 
                    (member.getClub() != null && member.getClub().getId().equals(clubId)))
                .collect(Collectors.toList());
    }

    /**
     * Compte les membres par rôle dans un club
     */
    public long countMembersByRole(UUID clubId, ClubRole role) {
        return memberRepository.findByClub_Id(clubId)
                .stream()
                .filter(member -> role.equals(member.getClubRole()))
                .count();
    }

    /**
     * Recherche avancée avec critères multiples
     */
    public List<Member> advancedMemberSearch(String nameFilter, String cityFilter, 
                                           Integer minAge, Integer maxAge, ClubRole roleFilter) {
        return memberRepository.findAll().stream()
                .filter(member -> nameFilter == null || 
                    member.getName().toLowerCase().contains(nameFilter.toLowerCase()))
                .filter(member -> cityFilter == null || 
                    (member.getCity() != null && member.getCity().equalsIgnoreCase(cityFilter)))
                .filter(member -> roleFilter == null || roleFilter.equals(member.getClubRole()))
                .filter(member -> {
                    if (minAge == null && maxAge == null) return true;
                    if (member.getBirthDate() == null) return false;
                    
                    int age = Period.between(member.getBirthDate(), LocalDate.now()).getYears();
                    boolean minCondition = minAge == null || age >= minAge;
                    boolean maxCondition = maxAge == null || age <= maxAge;
                    return minCondition && maxCondition;
                })
                .collect(Collectors.toList());
    }

    /**
     * Vérifie si un email existe déjà (avec Optional et Stream)
     */
    public boolean emailExists(String email) {
        return Optional.ofNullable(email)
                .map(String::toLowerCase)
                .map(memberRepository::findByEmail)
                .isPresent();
    }
}