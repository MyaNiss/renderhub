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
    private Long totalPrice;
    private LocalDateTime createdAt;

    private UserDTO user;
    private List<OrderItemDTO> orderItems;


    @NotBlank(message = "주문 상태는 필수 입니다")
    private String status;

    @NotBlank(message = "토스 주문 코드는 필수입니다")
    private String tossOrderCode;

    private String pgTid;

    public static UserOrderDTO fromEntity(UserOrderEntity entity, List<OrderItemDTO> itemDTOS) {

        UserDTO userDTO = entity.getUser() != null ? UserDTO.from(entity.getUser()) : null;

        return UserOrderDTO.builder()
                .orderId(entity.getOrderId())
                .totalPrice(entity.getTotalPrice())
                .status(entity.getStatus())
                .tossOrderCode(entity.getTossOrderCode())
                .pgTid(entity.getPgTid())
                .createdAt(entity.getCreatedAt())
                .orderItems(itemDTOS)
                .user(UserDTO.from(entity.getUser()))
                .build();
    }

}
