package app.back.code.transaction.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class CartResponseDTO {
    private List<CartDTO> cartItems;

    private Long totalPrice;

    private int totalCount;
}
