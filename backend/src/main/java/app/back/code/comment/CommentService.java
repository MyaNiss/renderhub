package app.back.code.comment;

import app.back.code.article.repository.ArticleRepository;
import app.back.code.comment.dto.CommentDTO;
import app.back.code.comment.entity.CommentEntity;
import app.back.code.comment.repository.CommentRepository;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ArticleRepository articleRepository;
    private final PostRepository postRepository;


    private void validateTargetexists(String targetType, Long targetId) {
        if("ARTICLE".equalsIgnoreCase(targetType)) {
            if(!articleRepository.existsById(targetId)) {
                throw(new EntityNotFoundException("대상으로 할 게시글을 찾을 수 없습니다"));
            }
        }else if("POST".equalsIgnoreCase(targetType)) {
            if(!postRepository.excistsById(targetId)) {
                throw(new EntityNotFoundException("대상으로 할 게시글을 찾을 수 없습니다"));
            }
        }else {
            throw new IllegalArgumentException("지원하지 않는 대상 타입입니다");
        }
    }

    @Transactional
    public CommentDTO createComment(CommentDTO request, String writerId) {
        UserAccountEntity writer = userRepository.findByUserId(writerId)
                .orElseThrow(() -> new EntityNotFoundException("작성자를 찾을 수 없습니다"));

        validateTargetexists(request.getTargetType(), request.getTargetId());

        CommentEntity newComment = CommentEntity.builder()
                .writer(writer)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .content(request.getContent())
                .build();

        commentRepository.save(newComment);

        return CommentDTO.fromEntity(newComment);
    }

    public Page<CommentDTO> getCommentlist(String targetType, Long targetId, Pageable pageable) {
        validateTargetexists(targetType, targetId);

        Page<CommentEntity> comments = commentRepository.findByTargetTypeAndTargetId(targetType, targetId, pageable);

        return comments.map(CommentDTO::fromEntity);
    }

    @Transactional
    public CommentDTO updateComment(Long commentId, CommentDTO request, String userId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다"));

        if(!comment.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("댓글 수정 권한이 없습니다");
        }

        comment.updateContent(request.getContent());

        return CommentDTO.fromEntity(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, String userId) {
        CommentEntity comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다"));

        if(!comment.getWriter().getUserId().equals(userId)) {
            throw new IllegalArgumentException("댓글 수정 권한이 없습니다");
        }

        commentRepository.delete(comment);
    }

}
