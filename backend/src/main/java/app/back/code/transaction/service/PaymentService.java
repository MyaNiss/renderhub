package app.back.code.transaction.service;

import app.back.code.transaction.PaymentApiException;
import app.back.code.transaction.dto.ConfirmRequestDTO;
import app.back.code.transaction.dto.PaymentResultDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Map;

@Service
public class PaymentService {

    @Value("${payment.toss.secret-key}")
    private String tossSecretKey;

    @Value("${payment.toss.confirm-url}")
    private String tossConfirmUrl;

    private final RestTemplate restTemplate;

    public PaymentService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PaymentResultDTO confirmPayment(String orderId, Long amount, String paymentKey) {

        // 시크릿 키 뒤에 콜론을 붙여 Base64 인코딩
        String encodedAuth = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes());
        String authHeader = "Basic " + encodedAuth;

        // 1. HTTP Header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 2. 요청 Body 구성
        ConfirmRequestDTO requestBody = new ConfirmRequestDTO(paymentKey, amount, orderId);
        HttpEntity<ConfirmRequestDTO> entity =  new HttpEntity<>(requestBody, headers);

        try {
            // 3. 🚨 API 호출 및 응답 처리
            ResponseEntity<Map> response = restTemplate.exchange(
                    tossConfirmUrl,
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // 💡 토스 응답에서 거래 ID 추출 (결제 성공 비즈니스 로직)
                String transactionId = (String) responseBody.get("mId"); // 예시: mId 또는 paymentKey를 사용
                Long confirmedAmount = ((Number) responseBody.get("totalAmount")).longValue();

                // 💡 응답된 금액과 요청된 DB 금액(amount)이 일치하는지 최종 검증하는 로직이 추가되어야 함

                return new PaymentResultDTO(transactionId, confirmedAmount, "TOSS");

            } else {
                throw new PaymentApiException("토스 결제 승인에 실패했습니다. (HTTP 상태: " + response.getStatusCode() + ")");
            }
        } catch (Exception e) {
            throw new PaymentApiException("토스 서버 통신 또는 승인 처리 중 오류 발생", e);
        }
    }
}