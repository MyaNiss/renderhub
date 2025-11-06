package app.back.code.comment.dto;

import app.back.code.comment.entity.CommentEntity;
import app.back.code.common.entity.BaseEntity;
import app.back.code.user.dto.UserDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class CommentDTO extends BaseEntity {

    private Long commentId;
    private UserDTO writer;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @NotBlank(message = "댓글 타입 지정은 필수입니다")
    private String targetType;

    @NotBlank(message = "대상 ID는 필수입니다")
    private Long targetId;

    @NotBlank(message = "댓글 내용은 필수입니다")
    @Size(max = 500, message = "댓글은 최대 500자까지입니다")
    private String content;

    public static CommentDTO fromEntity(CommentEntity entity) {
        return CommentDTO.builder()
                .commentId(entity.getCommentId())
                .targetType(entity.getTargetType())
                .targetId(entity.getTargetId())
                .content(entity.getContent())
                .writer(UserDTO.from(entity.getWriter()))
                .build();
    }


}
