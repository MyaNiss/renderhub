package app.back.code.transaction.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartRequestDTO {
    @NotNull(message = "상품 ID는 필수입니다")
    private Long postId;
}
