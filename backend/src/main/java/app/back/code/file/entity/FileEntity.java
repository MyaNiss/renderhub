package app.back.code.file.entity;

import app.back.code.article.entity.ArticleEntity;
import app.back.code.post.entity.PostEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "file")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = {"post", "article"})
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "file_id")
    private Long fileId;

    @Column(name = "file_use_type", length = 30, nullable = false)
    private String fileUseType;

    @Column(name = "original_name", length = 255, nullable = false)
    private String originalName;

    @Column(name = "stored_path", length = 255, nullable = false)
    private String storedPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private PostEntity post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private ArticleEntity article;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Builder
    public FileEntity(String fileUseType, String originalName, String storedPath, PostEntity post, ArticleEntity article, Integer displayOrder) {
        this.fileUseType = fileUseType;
        this.originalName = originalName;
        this.storedPath = storedPath;
        this.post = post;
        this.article = article;
        this.displayOrder = displayOrder;
    }
}
