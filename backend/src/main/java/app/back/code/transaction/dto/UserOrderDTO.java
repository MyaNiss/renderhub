package app.back.code.transaction.dto;

import app.back.code.transaction.entity.OrderItemEntity;
import app.back.code.transaction.entity.UserOrderEntity;
import app.back.code.user.dto.UserDTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class UserOrderDTO {

    private Long orderId;
    private UserDTO user;
    private LocalDateTime createdAt;

    private List<OrderItemDTO> orderItems;

    @NotNull(message = "총 결제 금액은 필수 입니다")
    private Long totalPrice;

    @NotBlank(message = "주문 상태는 필수 입니다")
    private String status;

    @NotBlank(message = "PG 타입은 필수입니다.")
    private String pgType;

    private String pgTid;

    public static UserOrderDTO fromEntity(UserOrderEntity entity, List<OrderItemDTO> itemDTOS) {
        return UserOrderDTO.builder()
                .orderId(entity.getOrderId())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .pgType(entity.getPgType())
                .pgTid(entity.getPgTid())
                .createdAt(entity.getCreatedAt())
                .orderItems(itemDTOS)
                .user(UserDTO.from(entity.getUser()))
                .build();
    }

}
