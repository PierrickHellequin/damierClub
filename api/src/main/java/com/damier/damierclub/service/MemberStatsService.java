package com.damier.damierclub.service;

import com.damier.damierclub.dto.MemberStatsDTO;
import com.damier.damierclub.dto.PointsEvolutionDTO;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.PointsHistory;
import com.damier.damierclub.model.Tournament;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.PointsHistoryRepository;
import com.damier.damierclub.repository.TournamentParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberStatsService {

    private final MemberRepository memberRepository;
    private final TournamentParticipationRepository participationRepository;
    private final PointsHistoryRepository pointsHistoryRepository;

    @Transactional(readOnly = true)
    public MemberStatsDTO getMemberStats(UUID memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));

        MemberStatsDTO stats = new MemberStatsDTO();

        // Compter nombre de tournois
        Long totalTournaments = participationRepository.countByMemberId(memberId);
        stats.setTotalTournaments(totalTournaments != null ? totalTournaments : 0L);

        // Sommer victoires, défaites, nuls
        Long victories = participationRepository.sumVictoriesByMemberId(memberId);
        Long defeats = participationRepository.sumDefeatsByMemberId(memberId);
        Long draws = participationRepository.sumDrawsByMemberId(memberId);

        stats.setTotalVictories(victories != null ? victories : 0L);
        stats.setTotalDefeats(defeats != null ? defeats : 0L);
        stats.setTotalDraws(draws != null ? draws : 0L);

        // Calculer taux de victoire
        long totalGames = stats.getTotalVictories() + stats.getTotalDefeats() + stats.getTotalDraws();
        if (totalGames > 0) {
            double winRate = (stats.getTotalVictories() * 100.0) / totalGames;
            stats.setWinRate(Math.round(winRate * 10.0) / 10.0); // Arrondir à 1 décimale
        } else {
            stats.setWinRate(0.0);
        }

        // Points actuel
        stats.setCurrentPoints(member.getCurrentPoints() != null ? member.getCurrentPoints() : 0);

        // Trouver points max et min dans l'historique
        List<PointsHistory> history = pointsHistoryRepository.findAllByMemberIdOrderByChangedAtAsc(memberId);
        if (!history.isEmpty()) {
            Integer maxPoints = history.stream()
                    .map(PointsHistory::getPointsAfter)
                    .max(Integer::compareTo)
                    .orElse(stats.getCurrentPoints());
            Integer minPoints = history.stream()
                    .map(PointsHistory::getPointsAfter)
                    .min(Integer::compareTo)
                    .orElse(stats.getCurrentPoints());

            stats.setHighestPoints(maxPoints);
            stats.setLowestPoints(minPoints);
        } else {
            stats.setHighestPoints(stats.getCurrentPoints());
            stats.setLowestPoints(stats.getCurrentPoints());
        }

        return stats;
    }

    @Transactional(readOnly = true)
    public List<PointsEvolutionDTO> getMemberPointsEvolution(UUID memberId) {
        // Utiliser tournament_participations au lieu de points_history
        var participations = participationRepository.findByMemberIdOrderByTournamentStartDateAsc(memberId);

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found: " + memberId));

        // Calculer les points cumulés si pointsAfter est NULL
        // Partir du rate actuel et déduire les évolutions en remontant dans le temps
        List<PointsEvolutionDTO> result = new java.util.ArrayList<>();
        Integer rate = member.getRate();
        int currentPoints = (rate != null) ? rate : 1600;

        // Calculer la somme totale des changements
        int totalChange = participations.stream()
                .mapToInt(tp -> tp.getPointsChange() != null ? tp.getPointsChange() : 0)
                .sum();

        // Points de départ = points actuels - total des changements
        int startingPoints = currentPoints - totalChange;
        int runningPoints = startingPoints;

        for (var tp : participations) {
            int pointsChange = tp.getPointsChange() != null ? tp.getPointsChange() : 0;
            runningPoints += pointsChange;

            PointsEvolutionDTO dto = new PointsEvolutionDTO();
            dto.setDate(tp.getTournament().getStartDate().atStartOfDay());
            dto.setPoints(runningPoints);
            dto.setPointsChange(pointsChange);
            dto.setReason("Tournoi");

            Tournament tournament = tp.getTournament();
            dto.setTournamentId(tournament.getId());
            dto.setTournamentName(tournament.getName());

            result.add(dto);
        }

        return result;
    }
}
