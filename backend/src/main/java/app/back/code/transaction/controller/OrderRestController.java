package app.back.code.transaction.controller;

import app.back.code.security.dto.UserSecureDTO;
import app.back.code.transaction.dto.PaymentConfirmRequestDTO;
import app.back.code.transaction.dto.PaymentRequestDTO;
import app.back.code.transaction.dto.PaymentResultDTO;
import app.back.code.transaction.dto.UserOrderDTO;
import app.back.code.transaction.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderRestController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<UserOrderDTO>> getOrderList(
            @AuthenticationPrincipal UserSecureDTO userDTO) {
        String userId = userDTO.getUserId();
        List<UserOrderDTO> orderList = orderService.getOrderList(userId);
        return ResponseEntity.ok(orderList);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderDTO> getOrderDetail(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @PathVariable Long orderId) throws AccessDeniedException {
        String userId = userSecureDTO.getUserId();
        UserOrderDTO orderDetail = orderService.getOrderDetails(orderId, userId);

        return ResponseEntity.ok(orderDetail);
    }


    @PostMapping
    public ResponseEntity<UserOrderDTO> initializeOrder(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @RequestBody @Valid PaymentRequestDTO requestDTO) {
        String userId = userSecureDTO.getUserId();

        UserOrderDTO orderDTO = orderService.initializeOrder(
                userId,
                requestDTO.getPostId()
        );
        return new ResponseEntity<>(orderDTO, HttpStatus.CREATED);
    }

    @PostMapping("/confirm")
    public ResponseEntity<UserOrderDTO> confirmOrder(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @RequestBody @Valid PaymentConfirmRequestDTO request) {
        String userId = userSecureDTO.getUserId();

        UserOrderDTO confirmedOrder = orderService.confirmOrderTransaction(
                request.getOrderId(),
                request.getPaymentKey(),
                userId
        );
        return ResponseEntity.ok(confirmedOrder);
    }



}
