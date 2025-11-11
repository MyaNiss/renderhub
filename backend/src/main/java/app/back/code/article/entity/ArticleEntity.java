package app.back.code.article.entity;

import app.back.code.common.entity.BaseEntity;
import app.back.code.common.entity.CategoryEntity;
import app.back.code.user.entity.UserAccountEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "article")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true)
@EntityListeners(AuditingEntityListener.class)
public class ArticleEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_id")
    private Long articleId;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private UserAccountEntity writer;

    @Column(name = "article_type", length = 10, nullable = false)
    @Enumerated(EnumType.STRING)
    private ArticleType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_secret", nullable = false)
    private Boolean isSecret = false;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    public ArticleEntity(Long articleId){
        this.articleId = articleId;
    }

    @Builder
    public ArticleEntity(String title, UserAccountEntity writer, ArticleType type, CategoryEntity category, String content, Boolean isSecret) {
        this.title = title;
        this.writer = writer;
        this.type = type;
        this.category = category;
        this.content = content;
        this.isSecret = isSecret != null ? isSecret : false;
    }

    public void update(String title, String content, CategoryEntity category, Boolean isSecret) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.isSecret = isSecret != null ? isSecret : false;
    }

    public void increaseViewCount() {
        this.viewCount++;
    }
}
