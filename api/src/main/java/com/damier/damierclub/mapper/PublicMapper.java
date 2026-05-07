package com.damier.damierclub.mapper;

import com.damier.damierclub.dto.MovePairDTO;
import com.damier.damierclub.dto.PublicArticleDTO;
import com.damier.damierclub.dto.PublicArticleSummaryDTO;
import com.damier.damierclub.dto.PublicAuthorDTO;
import com.damier.damierclub.dto.PublicClubDTO;
import com.damier.damierclub.dto.PublicClubSummaryDTO;
import com.damier.damierclub.dto.PublicEloPointDTO;
import com.damier.damierclub.dto.PublicExerciseDTO;
import com.damier.damierclub.dto.PublicPlayerDTO;
import com.damier.damierclub.dto.PublicPlayerSummaryDTO;
import com.damier.damierclub.dto.PublicTournamentResultDTO;
import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.PointsHistory;
import com.damier.damierclub.model.TournamentParticipation;

import java.util.List;

public final class PublicMapper {

    private PublicMapper() {}

    public static PublicAuthorDTO toAuthor(Member member) {
        if (member == null) return null;
        return new PublicAuthorDTO(member.getFirstName(), member.getLastName());
    }

    public static PublicArticleSummaryDTO toArticleSummary(Article article) {
        if (article == null) return null;
        return new PublicArticleSummaryDTO(
            article.getId(),
            article.getSlug(),
            article.getTitle(),
            article.getExcerpt(),
            article.getCategory(),
            article.getCoverImage(),
            article.getTags(),
            article.getPublishedAt(),
            article.getViewCount(),
            article.getFeatured(),
            toAuthor(article.getAuthor())
        );
    }

    public static PublicArticleDTO toArticle(Article article) {
        if (article == null) return null;
        return new PublicArticleDTO(
            article.getId(),
            article.getSlug(),
            article.getTitle(),
            article.getExcerpt(),
            article.getContent(),
            article.getCategory(),
            article.getCoverImage(),
            article.getTags(),
            article.getPublishedAt(),
            article.getViewCount(),
            article.getFeatured(),
            toAuthor(article.getAuthor())
        );
    }

    public static PublicClubSummaryDTO toClubSummary(Club club, long membersCount) {
        if (club == null) return null;
        return new PublicClubSummaryDTO(
            club.getId(),
            club.getName(),
            club.getCity(),
            club.getLogoUrl(),
            membersCount
        );
    }

    public static PublicClubDTO toClub(Club club, long membersCount) {
        if (club == null) return null;
        return new PublicClubDTO(
            club.getId(),
            club.getName(),
            club.getCity(),
            club.getAddress(),
            club.getWebsite(),
            club.getLogoUrl(),
            club.getDescription(),
            club.getCreationDate(),
            club.getPresident(),
            club.getVicePresident(),
            club.getSecretaire(),
            club.getTresorier(),
            membersCount
        );
    }

    public static PublicExerciseDTO toExercise(Exercise ex, List<MovePairDTO> solutionMoves) {
        if (ex == null) return null;
        return new PublicExerciseDTO(
            ex.getId() != null ? ex.getId().toString() : null,
            ex.getTitle(),
            ex.getDescription(),
            ex.getPosition(),
            ex.getSideToPlay() == Exercise.Side.BLACK ? "black" : "white",
            ex.getDifficulty(),
            ex.getSolution(),
            solutionMoves == null || solutionMoves.isEmpty() ? null : solutionMoves,
            ex.getPublishedAt()
        );
    }

    public static PublicPlayerSummaryDTO toPlayerSummary(Member m) {
        if (m == null) return null;
        Club club = m.getClub();
        return new PublicPlayerSummaryDTO(
            m.getId(),
            m.getFirstName(),
            m.getLastName(),
            m.getCity(),
            m.getCurrentPoints(),
            m.getRanking(),
            m.getFfjdId(),
            club != null ? club.getId() : null,
            club != null ? club.getName() : null
        );
    }

    public static PublicPlayerDTO toPlayer(
        Member m,
        long totalTournaments,
        long totalVictories,
        long totalDefeats,
        long totalDraws,
        Double winRate,
        Integer highestPoints,
        Integer lowestPoints
    ) {
        if (m == null) return null;
        Club club = m.getClub();
        return new PublicPlayerDTO(
            m.getId(),
            m.getFirstName(),
            m.getLastName(),
            m.getCity(),
            m.getCurrentPoints(),
            m.getRanking(),
            m.getFfjdId(),
            m.getRegistrationDate(),
            m.getClubRole(),
            club != null ? club.getId() : null,
            club != null ? club.getName() : null,
            totalTournaments,
            totalVictories,
            totalDefeats,
            totalDraws,
            winRate,
            highestPoints,
            lowestPoints
        );
    }

    public static PublicEloPointDTO toEloPoint(PointsHistory h) {
        if (h == null) return null;
        String label = h.getTournament() != null ? h.getTournament().getName() : h.getReason();
        return new PublicEloPointDTO(
            h.getChangedAt(),
            h.getPointsAfter(),
            h.getPointsChange(),
            label
        );
    }

    public static PublicTournamentResultDTO toTournamentResult(TournamentParticipation tp) {
        if (tp == null) return null;
        return new PublicTournamentResultDTO(
            tp.getTournament() != null ? tp.getTournament().getId() : null,
            tp.getTournament() != null ? tp.getTournament().getName() : null,
            tp.getTournament() != null ? tp.getTournament().getStartDate() : null,
            tp.getTournament() != null ? tp.getTournament().getType() : null,
            tp.getTournament() != null ? tp.getTournament().getCategory() : null,
            tp.getTournament() != null ? tp.getTournament().getLocation() : null,
            tp.getPlace(),
            tp.getPointsChange(),
            tp.getPointsAfter(),
            tp.getVictories(),
            tp.getDefeats(),
            tp.getDraws()
        );
    }
}
