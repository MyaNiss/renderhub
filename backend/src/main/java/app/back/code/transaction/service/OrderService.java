package app.back.code.transaction.service;

import app.back.code.post.entity.PostEntity;
import app.back.code.post.repository.PostRepository;
import app.back.code.transaction.PaymentApiException;
import app.back.code.transaction.dto.OrderItemDTO;
import app.back.code.transaction.dto.PaymentResultDTO;
import app.back.code.transaction.dto.UserOrderDTO;
import app.back.code.transaction.entity.CartEntity;
import app.back.code.transaction.entity.OrderItemEntity;
import app.back.code.transaction.entity.TransactionHistoryEntity;
import app.back.code.transaction.entity.UserOrderEntity;
import app.back.code.transaction.repository.*;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service("orderService")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {
    @Value("${payment.toss.secret-key}")
    private String tossSecretKey;

    @Value("${payment.toss.confirm-url}")
    private String tossConfirmUrl;

    private final RestTemplate restTemplate;

    private final UserOrderRepository userOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    private final PaymentService paymentService;

    @Transactional
    public UserOrderDTO initializeOrder(String userId, Long postId) {

        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자(ID: " + userId + ")를 찾을 수 없습니다."));

        List<PostEntity> purchasedPosts;
        Long totalPrice;

        if (postId != null) {
            PostEntity post = postRepository.findById(postId)
                    .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));

            purchasedPosts = List.of(post);
            totalPrice = post.getPrice();

        } else {
            List<CartEntity> cartItems = cartRepository.findByUser_UserId(userId);
            if (cartItems.isEmpty()) {
                throw new IllegalArgumentException("장바구니에 담긴 상품이 없습니다.");
            }
            purchasedPosts = cartItems.stream().map(CartEntity::getPost).collect(Collectors.toList());
            totalPrice = cartItems.stream().mapToLong(cart -> cart.getPost().getPrice()).sum();
        }

        String tossOrderCode = UUID.randomUUID().toString().replaceAll("-", "");

        UserOrderEntity newOrder = UserOrderEntity.builder()
                .user(user)
                .totalPrice(totalPrice)
                .pgTid(null)
                .tossOrderCode(tossOrderCode)
                .status("PENDING")
                .build();
        userOrderRepository.save(newOrder);

        List<OrderItemEntity> orderItems = purchasedPosts.stream()
                .map(post -> OrderItemEntity.builder()
                        .order(newOrder)
                        .post(post)
                        .price(post.getPrice())
                        .build())
                .collect(Collectors.toList());
        orderItemRepository.saveAll(orderItems);

        List<OrderItemDTO> itemDTOS = orderItems.stream()
                .map(OrderItemDTO::fromEntity)
                .collect(Collectors.toList());

        return UserOrderDTO.fromEntity(newOrder, itemDTOS);
    }

    @Transactional(rollbackFor = PaymentApiException.class)
    public UserOrderDTO confirmOrderTransaction(String tossOrderCode, String paymentKey, String currentUserId) {

        UserOrderEntity order = userOrderRepository.findByTossOrderCode(tossOrderCode)
                .orElseThrow(() -> new EntityNotFoundException("주문(ID: " + tossOrderCode + ")을 찾을 수 없습니다."));

        if (!order.getUser().getUserId().equals(currentUserId)) {
            throw new SecurityException("해당 주문에 대한 권한이 없습니다.");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("이미 처리된 주문입니다. (상태: " + order.getStatus() + ")");
        }

        PaymentResultDTO result = paymentService.confirmPayment(
             tossOrderCode,
             order.getTotalPrice(),
             paymentKey);


        order.setStatus("PAID");
        order.setPgTid(result.getTransactionId());
        userOrderRepository.save(order);

        List<OrderItemEntity> paidItems = orderItemRepository.findByOrder_OrderId(order.getOrderId());
        List<Long> postIds = paidItems.stream().map(item -> item.getPost().getPostId()).collect(Collectors.toList());

        for (OrderItemEntity item : paidItems) {
            PostEntity post = item.getPost();

            TransactionHistoryEntity history = TransactionHistoryEntity.builder()
                    .user(order.getUser())
                    .post(post)
                    .order(order)
                    .build();
            transactionHistoryRepository.save(history);

            post.incrementPurchaseCount();
        }


        List<CartEntity> cartsToDelete = cartRepository.findByUser_UserIdAndPost_PostIdIn(currentUserId, postIds);
        cartRepository.deleteAll(cartsToDelete);

        List<OrderItemDTO> itemDTOS = paidItems.stream()
                .map(OrderItemDTO::fromEntity)
                .collect(Collectors.toList());

        return UserOrderDTO.fromEntity(order, itemDTOS);
    }

    public List<UserOrderDTO> getOrderList(String userId) {
        List<UserOrderEntity> orders = userOrderRepository.findByUser_UserId(userId);
        return orders.stream()
                .map(order -> {
                    List<OrderItemEntity> items = orderItemRepository.findByOrder_OrderId(order.getOrderId());
                    List<OrderItemDTO> itemDTOS = items.stream().map(OrderItemDTO::fromEntity).collect(Collectors.toList());
                    return UserOrderDTO.fromEntity(order, itemDTOS);
                })
                .collect(Collectors.toList());
    }

    public UserOrderDTO getOrderDetails(Long orderId, String currentUserId) throws AccessDeniedException {
        UserOrderEntity order = userOrderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("주문(ID: " + orderId + ")을 찾을 수 없습니다."));

        if(!order.getUser().getUserId().equals(currentUserId)){
            throw new AccessDeniedException("해당 주문에 대한 접근 권한이 없습니다");
        }

        List<OrderItemEntity> items = orderItemRepository.findByOrder_OrderId(orderId);
        List<OrderItemDTO> itemDTOS = items.stream()
                .map(OrderItemDTO::fromEntity)
                .collect(Collectors.toList());

        return UserOrderDTO.fromEntity(order, itemDTOS);
    }
}