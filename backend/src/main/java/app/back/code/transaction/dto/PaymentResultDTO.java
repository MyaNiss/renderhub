package app.back.code.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@AllArgsConstructor
public class PaymentResultDTO {

    private String transactionId;

    private Long confirmedAmount;

    private String pgType;

}
