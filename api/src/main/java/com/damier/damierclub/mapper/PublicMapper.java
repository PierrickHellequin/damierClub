package com.damier.damierclub.mapper;

import com.damier.damierclub.dto.PublicArticleDTO;
import com.damier.damierclub.dto.PublicArticleSummaryDTO;
import com.damier.damierclub.dto.PublicAuthorDTO;
import com.damier.damierclub.dto.PublicClubDTO;
import com.damier.damierclub.dto.PublicClubSummaryDTO;
import com.damier.damierclub.dto.PublicExerciseDTO;
import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Member;

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

    public static PublicExerciseDTO toExercise(Exercise ex) {
        if (ex == null) return null;
        return new PublicExerciseDTO(
            ex.getId() != null ? ex.getId().toString() : null,
            ex.getTitle(),
            ex.getDescription(),
            ex.getPosition(),
            ex.getSideToPlay() == Exercise.Side.BLACK ? "black" : "white",
            ex.getDifficulty(),
            ex.getSolution(),
            ex.getPublishedAt()
        );
    }
}
