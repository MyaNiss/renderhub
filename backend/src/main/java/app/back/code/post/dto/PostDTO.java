package app.back.code.post.dto;

import app.back.code.post.entity.PostEntity;
import app.back.code.user.dto.UserDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PostDTO {

    private Long postId;
    private UserDTO writer;
    private Long price;
    private Integer viewCount;
    private Integer purchaseCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    private Boolean isDeleted;

    @NotBlank(message = "제목은 필수 입력 항목입니다")
    @Size(max = 100, message = "제목은 최대 100자입니다")
    private String title;

    @NotBlank(message = "내용은 필수 입력 항목입니다")
    private String content;

    @NotNull(message = "카테고리는 필수입니다")
    private Long categoryId;
    private Long fileTypeId;

    public static PostDTO fromEntity(PostEntity entity){
        return PostDTO.builder()
                .postId(entity.getPostId())
                .writer(UserDTO.from(entity.getWriter()))
                .categoryId(entity.getCategory().getCategoryId())
                .fileTypeId(entity.getCategory().getCategoryId())
                .title(entity.getTitle())
                .content(entity.getContent())
                .price(entity.getPrice())
                .viewCount(entity.getViewCount())
                .purchaseCount(entity.getPurchaseCount())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .deletedAt(entity.getDeletedAt())
                .isDeleted(entity.getIsDeleted())
                .build();

    }
}
