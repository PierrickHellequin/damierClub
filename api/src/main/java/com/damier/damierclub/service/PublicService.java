package com.damier.damierclub.service;

import com.damier.damierclub.dto.PublicArticleDTO;
import com.damier.damierclub.dto.PublicArticleSummaryDTO;
import com.damier.damierclub.dto.PublicClubDTO;
import com.damier.damierclub.dto.PublicClubSummaryDTO;
import com.damier.damierclub.dto.PublicEloPointDTO;
import com.damier.damierclub.dto.PublicExerciseDTO;
import com.damier.damierclub.dto.PublicPlayerDTO;
import com.damier.damierclub.dto.PublicPlayerSummaryDTO;
import com.damier.damierclub.dto.PublicStatsDTO;
import com.damier.damierclub.dto.PublicTournamentResultDTO;
import com.damier.damierclub.mapper.PublicMapper;
import com.damier.damierclub.model.Article;
import com.damier.damierclub.model.Article.ArticleCategory;
import com.damier.damierclub.model.Article.ArticleStatus;
import com.damier.damierclub.model.Club;
import com.damier.damierclub.model.Exercise;
import com.damier.damierclub.model.Member;
import com.damier.damierclub.model.PointsHistory;
import com.damier.damierclub.model.TournamentParticipation;
import com.damier.damierclub.repository.ArticleRepository;
import com.damier.damierclub.repository.ClubRepository;
import com.damier.damierclub.repository.ExerciseRepository;
import com.damier.damierclub.repository.MemberRepository;
import com.damier.damierclub.repository.PointsHistoryRepository;
import com.damier.damierclub.repository.TournamentParticipationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Read-only service that powers the public-facing API.
 * Always filters out non-PUBLISHED articles and never exposes sensitive fields.
 */
@Service
public class PublicService {

    private final ArticleRepository articleRepository;
    private final ClubRepository clubRepository;
    private final MemberRepository memberRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseService exerciseService;
    private final PointsHistoryRepository pointsHistoryRepository;
    private final TournamentParticipationRepository participationRepository;

    public PublicService(ArticleRepository articleRepository,
                         ClubRepository clubRepository,
                         MemberRepository memberRepository,
                         ExerciseRepository exerciseRepository,
                         ExerciseService exerciseService,
                         PointsHistoryRepository pointsHistoryRepository,
                         TournamentParticipationRepository participationRepository) {
        this.articleRepository = articleRepository;
        this.clubRepository = clubRepository;
        this.memberRepository = memberRepository;
        this.exerciseRepository = exerciseRepository;
        this.exerciseService = exerciseService;
        this.pointsHistoryRepository = pointsHistoryRepository;
        this.participationRepository = participationRepository;
    }

    public Page<PublicArticleSummaryDTO> listArticles(int page, int size,
                                                      ArticleCategory category,
                                                      String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<Article> articles;
        if (search != null && !search.isBlank()) {
            articles = articleRepository.searchArticlesByStatus(search, ArticleStatus.PUBLISHED, pageable);
        } else if (category != null) {
            articles = articleRepository.findByStatusAndCategory(ArticleStatus.PUBLISHED, category, pageable);
        } else {
            articles = articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable);
        }
        return articles.map(PublicMapper::toArticleSummary);
    }

    public List<PublicArticleSummaryDTO> featuredArticles() {
        return articleRepository.findByFeaturedTrueAndStatus(ArticleStatus.PUBLISHED).stream()
            .map(PublicMapper::toArticleSummary)
            .toList();
    }

    public List<PublicArticleSummaryDTO> recentArticles(int limit) {
        Pageable pageable = PageRequest.of(0, Math.max(1, Math.min(limit, 50)));
        return articleRepository.findRecentArticles(ArticleStatus.PUBLISHED, pageable).stream()
            .map(PublicMapper::toArticleSummary)
            .toList();
    }

    @Transactional
    public Optional<PublicArticleDTO> articleBySlug(String slug) {
        return articleRepository.findBySlugAndStatus(slug, ArticleStatus.PUBLISHED)
            .map(article -> {
                article.incrementViewCount();
                articleRepository.save(article);
                return PublicMapper.toArticle(article);
            });
    }

    public ArticleCategory[] articleCategories() {
        return ArticleCategory.values();
    }

    public Page<PublicClubSummaryDTO> listClubs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return clubRepository.findAll(pageable)
            .map(club -> PublicMapper.toClubSummary(club, memberRepository.countByClub_Id(club.getId())));
    }

    public Optional<PublicClubDTO> clubById(UUID id) {
        return clubRepository.findById(id)
            .map(club -> PublicMapper.toClub(club, memberRepository.countByClub_Id(club.getId())));
    }

    public PublicStatsDTO globalStats() {
        return new PublicStatsDTO(
            clubRepository.count(),
            memberRepository.countByActiveTrue(),
            articleRepository.countByStatus(ArticleStatus.PUBLISHED)
        );
    }

    public List<PublicExerciseDTO> listPublishedExercises() {
        return exerciseRepository
            .findByStatusOrderByDifficultyAscPublishedAtDesc(Exercise.Status.PUBLISHED)
            .stream()
            .map(ex -> PublicMapper.toExercise(ex, exerciseService.readSolutionMoves(ex)))
            .toList();
    }

    /**
     * Public player listing. Sorted by current points (descending) by default
     * so the page reads as a "ranking". Only active members are exposed.
     */
    public Page<PublicPlayerSummaryDTO> listPlayers(int page, int size, UUID clubId) {
        Pageable pageable = PageRequest.of(
            page, size,
            Sort.by(Sort.Order.desc("currentPoints"), Sort.Order.asc("lastName"))
        );
        Page<Member> members = clubId != null
            ? memberRepository.findByActiveTrueAndClub_Id(clubId, pageable)
            : memberRepository.findByActiveTrue(pageable);
        return members.map(PublicMapper::toPlayerSummary);
    }

    /** Hall of fame — top N active players by ELO. */
    public List<PublicPlayerSummaryDTO> topPlayers(int limit) {
        int safe = Math.min(Math.max(limit, 1), 20);
        return memberRepository.findTop20ByActiveTrueOrderByCurrentPointsDesc().stream()
            .limit(safe)
            .map(PublicMapper::toPlayerSummary)
            .toList();
    }

    public Optional<PublicPlayerDTO> playerById(UUID id) {
        return memberRepository.findById(id)
            .filter(m -> Boolean.TRUE.equals(m.getActive()))
            .map(this::buildPlayerDetail);
    }

    public List<PublicEloPointDTO> playerEloHistory(UUID id) {
        if (memberRepository.findById(id).filter(m -> Boolean.TRUE.equals(m.getActive())).isEmpty()) {
            return List.of();
        }
        return pointsHistoryRepository.findAllByMemberIdOrderByChangedAtAsc(id).stream()
            .map(PublicMapper::toEloPoint)
            .toList();
    }

    public List<PublicTournamentResultDTO> playerTournaments(UUID id) {
        if (memberRepository.findById(id).filter(m -> Boolean.TRUE.equals(m.getActive())).isEmpty()) {
            return List.of();
        }
        return participationRepository.findByMemberIdOrderByTournamentStartDateAsc(id).stream()
            .map(PublicMapper::toTournamentResult)
            .toList();
    }

    private PublicPlayerDTO buildPlayerDetail(Member m) {
        UUID id = m.getId();
        long total = participationRepository.countByMemberId(id);
        Long victories = participationRepository.sumVictoriesByMemberId(id);
        Long defeats = participationRepository.sumDefeatsByMemberId(id);
        Long draws = participationRepository.sumDrawsByMemberId(id);
        long v = victories != null ? victories : 0L;
        long d = defeats != null ? defeats : 0L;
        long n = draws != null ? draws : 0L;
        long played = v + d + n;
        Double winRate = played > 0 ? ((double) v) / played * 100.0 : null;

        Integer highest = null;
        Integer lowest = null;
        for (PointsHistory ph : pointsHistoryRepository.findAllByMemberIdOrderByChangedAtAsc(id)) {
            int pts = ph.getPointsAfter() != null ? ph.getPointsAfter() : 0;
            if (highest == null || pts > highest) highest = pts;
            if (lowest == null || pts < lowest) lowest = pts;
        }
        if (highest == null && m.getCurrentPoints() != null) highest = m.getCurrentPoints();
        if (lowest == null && m.getCurrentPoints() != null) lowest = m.getCurrentPoints();

        return PublicMapper.toPlayer(m, total, v, d, n, winRate, highest, lowest);
    }
}
