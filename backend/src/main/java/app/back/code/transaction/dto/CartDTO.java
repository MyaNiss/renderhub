package app.back.code.transaction.dto;

import app.back.code.post.dto.PostDTO;
import app.back.code.transaction.entity.CartEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.util.Optional;

@Getter
@Builder
public class CartDTO {

    private Long id;
    private PostDTO post;

    @NotNull(message = "상품 ID는 필수입니다")
    private Long postId;

    private Long price;

    public static CartDTO fromEntity(CartEntity entity) {
        return CartDTO.builder()
                .id(entity.getId())
                .postId(entity.getPost().getPostId())
                .post(PostDTO.fromEntity(entity.getPost()))
                .price(PostDTO.fromEntity(entity.getPost()).getPrice())
                .build();
    }
}
