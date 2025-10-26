package com.damier.damierclub.service;

import com.damier.damierclub.dto.GameDTO;
import com.damier.damierclub.dto.TournamentParticipationDTO;
import com.damier.damierclub.model.Game;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.Tournament;
import com.damier.damierclub.model.TournamentParticipation;
import com.damier.damierclub.repository.GameRepository;
import com.damier.damierclub.repository.TournamentParticipationRepository;
import com.damier.damierclub.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TournamentService {

    private final TournamentRepository tournamentRepository;
    private final TournamentParticipationRepository participationRepository;
    private final GameRepository gameRepository;

    @Transactional(readOnly = true)
    public Page<Tournament> getAllTournaments(Pageable pageable) {
        return tournamentRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<Tournament> getActiveTournaments(Pageable pageable) {
        return tournamentRepository.findByActiveTrue(pageable);
    }

    @Transactional(readOnly = true)
    public List<Tournament> getUpcomingTournaments() {
        return tournamentRepository.findUpcomingTournaments(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public Page<Tournament> getPastTournaments(Pageable pageable) {
        return tournamentRepository.findPastTournaments(LocalDate.now(), pageable);
    }

    @Transactional(readOnly = true)
    public Tournament getTournamentById(UUID id) {
        return tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found: " + id));
    }

    @Transactional
    public Tournament createTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    @Transactional
    public Tournament updateTournament(UUID id, Tournament updatedTournament) {
        Tournament tournament = getTournamentById(id);
        tournament.setName(updatedTournament.getName());
        tournament.setStartDate(updatedTournament.getStartDate());
        tournament.setEndDate(updatedTournament.getEndDate());
        tournament.setType(updatedTournament.getType());
        tournament.setCategory(updatedTournament.getCategory());
        tournament.setLocation(updatedTournament.getLocation());
        tournament.setDescription(updatedTournament.getDescription());
        tournament.setActive(updatedTournament.getActive());
        return tournamentRepository.save(tournament);
    }

    @Transactional
    public void deleteTournament(UUID id) {
        tournamentRepository.deleteById(id);
    }

    // Récupérer participations d'un membre avec DTOs enrichis
    @Transactional(readOnly = true)
    public Page<TournamentParticipationDTO> getMemberParticipations(UUID memberId, Pageable pageable) {
        Page<TournamentParticipation> participations = participationRepository.findByMemberId(memberId, pageable);

        List<TournamentParticipationDTO> dtos = participations.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, participations.getTotalElements());
    }

    private TournamentParticipationDTO convertToDTO(TournamentParticipation participation) {
        TournamentParticipationDTO dto = new TournamentParticipationDTO();
        dto.setParticipationId(participation.getId());
        dto.setPlace(participation.getPlace());
        dto.setPointsChange(participation.getPointsChange());
        dto.setPointsAfter(participation.getPointsAfter());
        dto.setVictories(participation.getVictories());
        dto.setDefeats(participation.getDefeats());
        dto.setDraws(participation.getDraws());

        Tournament tournament = participation.getTournament();
        dto.setTournamentId(tournament.getId());
        dto.setTournamentName(tournament.getName());
        dto.setTournamentDate(tournament.getStartDate());
        dto.setTournamentType(tournament.getType());
        dto.setTournamentCategory(tournament.getCategory());
        dto.setTournamentLocation(tournament.getLocation());

        // Récupérer les parties avec adversaires et résultats
        // Exclure les parties contre soi-même (opponent_id = member_id)
        UUID memberId = participation.getMember().getId();
        List<Game> games = gameRepository.findByParticipationId(participation.getId());
        List<GameDTO> gameDTOs = games.stream()
                .filter(g -> g.getOpponent() != null)
                .filter(g -> !g.getOpponent().getId().equals(memberId)) // Exclure les parties contre soi-même
                .map(this::convertGameToDTO)
                .collect(Collectors.toList());
        dto.setGames(gameDTOs);

        return dto;
    }

    private GameDTO convertGameToDTO(Game game) {
        GameDTO gameDTO = new GameDTO();

        // Nom de l'adversaire
        Member opponent = game.getOpponent();
        if (opponent != null) {
            String firstName = opponent.getFirstName() != null ? opponent.getFirstName() : "";
            String lastName = opponent.getLastName() != null ? opponent.getLastName() : opponent.getName();
            gameDTO.setOpponentName((firstName + " " + lastName).trim());
            gameDTO.setOpponentPoints(opponent.getRate());
        }

        // Résultat et score
        gameDTO.setResult(game.getResult());

        // Calculer le score à partir du résultat
        // Dans le jeu de dames: WIN = 2-0, LOSS = 0-2, DRAW = 1-1
        String score = switch (game.getResult()) {
            case WIN -> "2-0";
            case LOSS -> "0-2";
            case DRAW -> "1-1";
        };
        gameDTO.setScore(score);

        return gameDTO;
    }
}
