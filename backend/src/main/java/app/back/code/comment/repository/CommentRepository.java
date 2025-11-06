package app.back.code.comment.repository;

import app.back.code.comment.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    Page<CommentEntity> findByTargetTypeAndTargetId(String targetType, Long targetId, Pageable pageable);

    List<CommentEntity> findByTargetTypeAndTargetId(String targetType, Long targetId);

    List<Long> findCommentIdByWriter_UserId(String userId);
}
