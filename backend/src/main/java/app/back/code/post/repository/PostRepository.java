package app.back.code.post.repository;

import app.back.code.post.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<PostEntity, Long>, JpaSpecificationExecutor<PostEntity> {

    List<Long> findPostIdByWriter_UserId(String userId);

    Page<PostEntity> findByCategory_CategoryIdInAndFileType_CategoryIdIn(
            List<Long> categoryIds,
            List<Long> fileTypeIds,
            Pageable pageable
    );

    Page<PostEntity> findByCategory_CategoryIdIn(
            List<Long> categoryIds,
            Pageable pageable
    );

    Page<PostEntity> findByFileType_CategoryIdIn(
            List<Long> fileTypeIds,
            Pageable pageable
    );
}