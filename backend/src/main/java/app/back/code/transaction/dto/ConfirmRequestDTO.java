package app.back.code.transaction.dto;

import lombok.Getter;

@Getter
public class ConfirmRequestDTO {
    private final String paymentKey;

    private final Long amount;

    private final String orderId;

    public ConfirmRequestDTO(String paymentKey, Long amount, String orderId) {
        this.paymentKey = paymentKey;
        this.amount = amount;
        this.orderId = orderId;
    }
}
