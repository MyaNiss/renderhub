package app.back.code.transaction.service;

import app.back.code.transaction.PaymentApiException;
import app.back.code.transaction.dto.ConfirmRequestDTO;
import app.back.code.transaction.dto.PaymentResultDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
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
        String encodedAuth = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));
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
                if(transactionId == null){
                    transactionId = paymentKey;
                }
                Long confirmedAmount = ((Number) responseBody.get("totalAmount")).longValue();

                if (!confirmedAmount.equals(amount)) {
                    cancelPayment(paymentKey, "결제 요청 금액(" + amount + ")과 토스 승인 금액(" + confirmedAmount + ") 불일치");

                    throw new PaymentApiException("결제 금액 불일치. 결제는 즉시 취소되었습니다.");
                }

                return new PaymentResultDTO(transactionId, confirmedAmount, "TOSS");

            } else {
                throw new PaymentApiException("토스 결제 승인에 실패했습니다. (HTTP 상태: " + response.getStatusCode() + ")");
            }
        } catch (Exception e) {
            throw new PaymentApiException("토스 서버 통신 또는 승인 처리 중 오류 발생", e);
        }
    }

    public void cancelPayment(String paymentKey, String cancelReason) throws PaymentApiException {

        // 1. Basic 인증 헤더 생성 (승인 요청과 동일)
        String encodedAuth = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));
        String authHeader = "Basic " + encodedAuth;

        // 2. HTTP Header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", authHeader);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 3. 요청 Body 구성 (취소 사유만 필수)
        Map<String, String> requestBody = Map.of("cancelReason", cancelReason);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        // 4. 취소 API URL 구성: /v1/payments/{paymentKey}/cancel
        String baseUrl = tossConfirmUrl.replace("/confirm", "");
        String cancelUrl = baseUrl + "/" + paymentKey + "/cancel";

        try {
            restTemplate.exchange(
                    cancelUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );
            // 200 OK 응답을 받으면 성공적으로 취소된 것으로 간주합니다.

        } catch (Exception e) {
            // 결제가 취소되지 않았을 경우, 로그를 남기고 심각한 예외를 던져 관리자 개입을 유도합니다.
            System.err.println("FATAL: 결제 취소 API 호출 실패. 즉시 확인 필요. PaymentKey: " + paymentKey + ", 사유: " + cancelReason);
            e.printStackTrace();
            throw new PaymentApiException("경고: 결제 취소 처리 실패. PaymentKey: " + paymentKey, e);
        }
    }
}