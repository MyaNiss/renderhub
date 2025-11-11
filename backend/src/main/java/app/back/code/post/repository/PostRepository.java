package app.back.code.post.repository;

import app.back.code.common.dto.SimplePostDTO;
import app.back.code.post.entity.PostEntity;
import app.back.code.user.entity.UserAccountEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long>, JpaSpecificationExecutor<PostEntity> {

    @Query("SELECT new app.back.code.common.dto.SimplePostDTO(a.postId, a.title)" + "FROM PostEntity a WHERE a.writer.userId = :userId")
    List<SimplePostDTO> findPostsByWriter_UserId(String userId);

    Page<PostEntity> findByCategory_CategoryIdInAndFileType_CategoryIdIn(
            List<Long> categoryIds,
            List<Long> fileTypeIds,
            Pageable pageable
    );

    @Query("SELECT DISTINCT p.category.categoryId FROM PostEntity p")
    List<Long> findAllCategoryIds();

    @Query("SELECT DISTINCT p.fileType.categoryId FROM PostEntity p")
    List<Long> findAllFileTypeIds();

    List<PostEntity> findAllByWriter(UserAccountEntity writer);

    Page<PostEntity> findAll(Pageable pageable);

    @Query(value = "SELECT p FROM PostEntity p " +
            "WHERE (:#{#categoryIds.size()} = 0 OR p.category.categoryId IN :categoryIds) " +
            "AND (:#{#fileTypeIds.size()} = 0 OR p.fileType.categoryId IN :fileTypeIds) " +
            "AND (:keyword IS NULL OR :keyword = '' OR " +
            "   (LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR p.content LIKE CONCAT('%', :keyword, '%')))")
    Page<PostEntity> findPostListByFiltersAndKeyword(
            @Param("categoryIds") List<Long> categoryIds,
            @Param("fileTypeIds") List<Long> fileTypeIds,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}