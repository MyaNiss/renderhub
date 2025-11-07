package app.back.code.transaction.dto;

import app.back.code.post.dto.PostDTO;
import app.back.code.transaction.entity.OrderItemEntity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderItemDTO {

    private Long orderItemId;
    private PostDTO post;

    @NotNull(message = "상품 ID는 필수입니다")
    private Long postId;

    private Long price;

    public static OrderItemDTO fromEntity(OrderItemEntity entity) {
        return OrderItemDTO.builder()
                .orderItemId(entity.getOrderItemId())
                .postId(entity.getPost().getPostId())
                .price(entity.getPrice())
                .post(PostDTO.fromEntity(entity.getPost()))
                .build();
    }
}
