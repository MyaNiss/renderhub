package app.back.code.article.DTO;

import app.back.code.article.entity.ArticleEntity;
import app.back.code.article.entity.ArticleType;
import app.back.code.user.dto.UserDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ArticleDTO {

    private Long articleId;
    private ArticleType type;
    private UserDTO writer;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotBlank(message = "제목은 필수 입력 항목입니다")
    @Size(max = 100, message = "제목은 최대 100자입니다")
    private String title;

    @NotBlank(message = "내용은 필수 입력 항목입니다")
    private String content;

    @NotNull(message = "카테고리는 필수입니다")
    private Long categoryId;

    private Boolean isSecret;

    public static ArticleDTO fromEntity(ArticleEntity entity){
        return ArticleDTO.builder()
                .articleId(entity.getArticleId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .type(entity.getType())
                .viewCount(entity.getViewCount())
                .isSecret(entity.getIsSecret())
                .categoryId(entity.getCategory().getCategoryId())
                .writer(UserDTO.from(entity.getWriter()))
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
