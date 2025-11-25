package com.damier.damierclub.service;

import com.damier.damierclub.dto.ClubStatsDTO;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.TournamentParticipation;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.TournamentParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClubService {

    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;
    private final TournamentParticipationRepository participationRepository;

    @Transactional(readOnly = true)
    public ClubStatsDTO getClubStats(UUID clubId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new RuntimeException("Club not found: " + clubId));

        List<Member> members = memberRepository.findByClub_Id(clubId);

        ClubStatsDTO stats = new ClubStatsDTO();
        stats.setTotalMembers((long) members.size());

        if (!members.isEmpty()) {
            // Calculer la moyenne des points
            double avgPoints = members.stream()
                    .filter(m -> m.getRate() > 0)
                    .mapToInt(Member::getRate)
                    .average()
                    .orElse(0);
            stats.setAveragePoints((int) Math.round(avgPoints));

            // Trouver le meilleur joueur
            Member topPlayer = members.stream()
                    .filter(m -> m.getRate() > 0)
                    .max((m1, m2) -> Integer.compare(m1.getRate(), m2.getRate()))
                    .orElse(null);

            if (topPlayer != null) {
                stats.setHighestPoints(topPlayer.getRate());
                stats.setTopPlayerName(topPlayer.getName());
            }

            // Calculer les victoires totales
            Long totalVictories = 0L;
            Long totalGames = 0L;

            for (Member member : members) {
                Long victories = participationRepository.sumVictoriesByMemberId(member.getId());
                Long defeats = participationRepository.sumDefeatsByMemberId(member.getId());
                Long draws = participationRepository.sumDrawsByMemberId(member.getId());

                totalVictories += (victories != null ? victories : 0);
                totalGames += (victories != null ? victories : 0)
                            + (defeats != null ? defeats : 0)
                            + (draws != null ? draws : 0);
            }

            stats.setTotalVictories(totalVictories);

            if (totalGames > 0) {
                double ratio = (totalVictories * 100.0) / totalGames;
                stats.setVictoryRatio(Math.round(ratio * 10.0) / 10.0);
            } else {
                stats.setVictoryRatio(0.0);
            }
        } else {
            stats.setAveragePoints(0);
            stats.setHighestPoints(0);
            stats.setTopPlayerName(null);
            stats.setTotalVictories(0L);
            stats.setVictoryRatio(0.0);
        }

        return stats;
    }
}
