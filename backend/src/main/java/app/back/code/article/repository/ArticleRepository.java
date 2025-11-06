package app.back.code.article.repository;

import app.back.code.article.entity.ArticleEntity;
import app.back.code.article.entity.ArticleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long>, JpaSpecificationExecutor<ArticleEntity> {

    List<Long> findArticleIdByWriter_UserId(String userId);

    Page<ArticleEntity> findByTypeAndCategory_CategoryIdIn(ArticleType articleType, List<Long> categoryId, Pageable pageable);

    Page<ArticleEntity> findByType(ArticleType articleType, Pageable pageable);

    List<ArticleEntity> findByType(ArticleType type);
}
