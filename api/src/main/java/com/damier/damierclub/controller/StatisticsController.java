package com.damier.damierclub.controller;

import com.damier.damierclub.dto.MemberDTO;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.ClubRole;
import com.damier.damierclub.service.StatisticsService;
import com.damier.damierclub.mapper.MemberMapper;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final MemberMapper memberMapper;

    public StatisticsController(StatisticsService statisticsService, MemberMapper memberMapper) {
        this.statisticsService = statisticsService;
        this.memberMapper = memberMapper;
    }

    /**
     * Statistiques générales sur les membres
     */
    @GetMapping("/members")
    public Map<String, Object> getMemberStatistics() {
        return statisticsService.getMemberStatistics();
    }

    /**
     * Statistiques générales sur les clubs
     */
    @GetMapping("/clubs")
    public Map<String, Object> getClubStatistics() {
        return statisticsService.getClubStatistics();
    }

    /**
     * Top des clubs par nombre de membres
     */
    @GetMapping("/clubs/top")
    public List<Map<String, Object>> getTopClubs(@RequestParam(defaultValue = "5") int limit) {
        return statisticsService.getTopClubsByMemberCount(limit);
    }

    /**
     * Distribution des âges des membres
     */
    @GetMapping("/members/age-distribution")
    public Map<String, Long> getAgeDistribution() {
        return statisticsService.getAgeDistribution();
    }

    /**
     * Recherche avancée de membres
     */
    @GetMapping("/members/search")
    public List<MemberDTO> advancedMemberSearch(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String role) {
        
        ClubRole clubRole = null;
        if (role != null) {
            try {
                clubRole = ClubRole.valueOf(role.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si le rôle n'existe pas, on retourne une liste vide
                return List.of();
            }
        }
        
        return statisticsService.advancedMemberSearch(name, city, minAge, maxAge, clubRole)
                .stream()
                .map(memberMapper::toDTO)
                .collect(Collectors.toList());
    }
}