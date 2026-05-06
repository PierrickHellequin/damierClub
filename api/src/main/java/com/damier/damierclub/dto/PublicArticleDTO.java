package com.damier.damierclub.dto;

import com.damier.damierclub.model.Article.ArticleCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicArticleDTO {
    private String id;
    private String slug;
    private String title;
    private String excerpt;
    private String content;
    private ArticleCategory category;
    private String coverImage;
    private List<String> tags;
    private LocalDateTime publishedAt;
    private Integer viewCount;
    private Boolean featured;
    private PublicAuthorDTO author;
}
