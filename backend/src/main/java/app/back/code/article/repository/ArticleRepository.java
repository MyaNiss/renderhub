package app.back.code.article.repository;

import app.back.code.article.entity.ArticleEntity;
import app.back.code.article.entity.ArticleType;
import app.back.code.common.dto.SimplePostDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long>, JpaSpecificationExecutor<ArticleEntity> {

    @Query("SELECT new app.back.code.common.dto.SimplePostDTO(a.articleId, a.title)" + "FROM ArticleEntity a WHERE a.writer.userId = :userId")
    List<SimplePostDTO> findArticlesByWriter_UserId(String userId);

    Page<ArticleEntity> findByTypeAndCategory_CategoryIdIn(ArticleType articleType, List<Long> categoryIds, Pageable pageable);

    Page<ArticleEntity> findByType(ArticleType articleType, Pageable pageable);

    List<ArticleEntity> findByType(ArticleType type);
}
