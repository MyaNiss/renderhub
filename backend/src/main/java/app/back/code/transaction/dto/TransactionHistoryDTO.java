package app.back.code.transaction.dto;

import app.back.code.post.dto.PostDTO;
import app.back.code.transaction.entity.TransactionHistoryEntity;
import app.back.code.user.dto.UserDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class TransactionHistoryDTO {

    private UserDTO user;
    private PostDTO post;
    private Long orderId;
    private LocalDateTime createdAt;

    public static TransactionHistoryDTO fromEntity(TransactionHistoryEntity entity) {
        return TransactionHistoryDTO.builder()
                .user(UserDTO.from(entity.getUser()))
                .post(PostDTO.fromEntity(entity.getPost()))
                .orderId(entity.getOrder().getOrderId())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
