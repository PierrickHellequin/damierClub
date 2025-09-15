package com.damier.damierclub.service;

import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.ClubRole;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.ClubRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    private final MemberRepository memberRepository;
    private final ClubRepository clubRepository;

    public StatisticsService(MemberRepository memberRepository, ClubRepository clubRepository) {
        this.memberRepository = memberRepository;
        this.clubRepository = clubRepository;
    }

    /**
     * Statistiques générales sur les membres avec Streams
     */
    public Map<String, Object> getMemberStatistics() {
        List<Member> allMembers = memberRepository.findAll();
        
        long totalMembers = allMembers.size();
        long activeMembers = allMembers.stream()
                .filter(member -> member.getClub() != null)
                .count();
        
        Map<String, Long> membersByRole = allMembers.stream()
                .filter(member -> member.getClubRole() != null)
                .collect(Collectors.groupingBy(
                    member -> member.getClubRole().getDisplayName(),
                    Collectors.counting()
                ));
        
        Map<String, Long> membersByCity = allMembers.stream()
                .filter(member -> member.getCity() != null)
                .collect(Collectors.groupingBy(
                    Member::getCity,
                    Collectors.counting()
                ));
        
        OptionalDouble averageAge = allMembers.stream()
                .filter(member -> member.getBirthDate() != null)
                .mapToInt(member -> Period.between(member.getBirthDate(), LocalDate.now()).getYears())
                .average();
        
        return Map.of(
            "totalMembers", totalMembers,
            "activeMembers", activeMembers,
            "inactiveMembers", totalMembers - activeMembers,
            "membersByRole", membersByRole,
            "membersByCity", membersByCity,
            "averageAge", averageAge.orElse(0.0)
        );
    }

    /**
     * Statistiques sur les clubs avec Streams
     */
    public Map<String, Object> getClubStatistics() {
        List<Club> allClubs = clubRepository.findAll();
        List<Member> allMembers = memberRepository.findAll();
        
        long totalClubs = allClubs.size();
        
        Map<String, Long> clubsByCity = allClubs.stream()
                .filter(club -> club.getCity() != null)
                .collect(Collectors.groupingBy(
                    Club::getCity,
                    Collectors.counting()
                ));
        
        Map<String, Long> membersPerClub = allMembers.stream()
                .filter(member -> member.getClub() != null)
                .collect(Collectors.groupingBy(
                    member -> member.getClub().getName(),
                    Collectors.counting()
                ));
        
        OptionalDouble averageMembersPerClub = membersPerClub.values().stream()
                .mapToLong(Long::longValue)
                .average();
        
        Optional<Map.Entry<String, Long>> mostPopularClub = membersPerClub.entrySet().stream()
                .max(Map.Entry.comparingByValue());
        
        return Map.of(
            "totalClubs", totalClubs,
            "clubsByCity", clubsByCity,
            "membersPerClub", membersPerClub,
            "averageMembersPerClub", averageMembersPerClub.orElse(0.0),
            "mostPopularClub", mostPopularClub.map(entry -> 
                Map.of("name", entry.getKey(), "memberCount", entry.getValue())
            ).orElse(Map.of())
        );
    }

    /**
     * Top N des clubs par nombre de membres
     */
    public List<Map<String, Object>> getTopClubsByMemberCount(int limit) {
        return memberRepository.findAll().stream()
                .filter(member -> member.getClub() != null)
                .collect(Collectors.groupingBy(
                    member -> member.getClub(),
                    Collectors.counting()
                ))
                .entrySet().stream()
                .sorted(Map.Entry.<Club, Long>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> Map.<String, Object>of(
                    "club", Map.of(
                        "id", entry.getKey().getId(),
                        "name", entry.getKey().getName(),
                        "city", Optional.ofNullable(entry.getKey().getCity()).orElse("Non spécifiée")
                    ),
                    "memberCount", entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Analyse des âges des membres par tranches
     */
    public Map<String, Long> getAgeDistribution() {
        return memberRepository.findAll().stream()
                .filter(member -> member.getBirthDate() != null)
                .map(member -> Period.between(member.getBirthDate(), LocalDate.now()).getYears())
                .collect(Collectors.groupingBy(
                    age -> {
                        if (age < 18) return "Moins de 18 ans";
                        else if (age < 30) return "18-29 ans";
                        else if (age < 50) return "30-49 ans";
                        else if (age < 65) return "50-64 ans";
                        else return "65 ans et plus";
                    },
                    Collectors.counting()
                ));
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
}