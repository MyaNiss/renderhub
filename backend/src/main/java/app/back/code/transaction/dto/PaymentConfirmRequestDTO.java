package app.back.code.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PaymentConfirmRequestDTO {
    @NotBlank
    private String paymentKey;

    @NotBlank
    private String orderId;
}
