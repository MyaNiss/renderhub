package app.back.code.transaction.service;

import app.back.code.post.entity.PostEntity;
import app.back.code.post.repository.PostRepository;
import app.back.code.transaction.dto.CartDTO;
import app.back.code.transaction.dto.CartResponseDTO;
import app.back.code.transaction.entity.CartEntity;
import app.back.code.transaction.repository.CartRepository;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;


    private CartResponseDTO mapEntitiesToResponse(List<CartEntity> cartEntities) {
        List<CartDTO> itemDTOS = cartEntities.stream()
                .map(CartDTO::fromEntity)
                .collect(Collectors.toList());

        Long totalPrice = itemDTOS.stream()
                .mapToLong(CartDTO::getPrice)
                .sum();

        return CartResponseDTO.builder()
                .cartItems(itemDTOS)
                .totalPrice(totalPrice)
                .totalCount(itemDTOS.size())
                .build();
    }

    @Transactional
    public CartResponseDTO getCartByUserId(String userId) {
        List<CartEntity> cartItems = cartRepository.findByUser_UserId(userId);
        return mapEntitiesToResponse(cartItems);
    }

    @Transactional
    public CartResponseDTO addPostToCart(String userId, Long postId) {
        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        PostEntity post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Optional<CartEntity> existingItem = cartRepository.findByUser_UserId(userId).stream()
                .filter(item -> item.getPost().getPostId().equals(postId))
                .findFirst();

        if(existingItem.isPresent()) {

        } else {
            CartEntity newCartItem = CartEntity.builder()
                    .user(user)
                    .post(post)
                    .build();
            cartRepository.save(newCartItem);
        }

        List<CartEntity> updatedCart = cartRepository.findByUser_UserId(userId);
        return mapEntitiesToResponse(updatedCart);
    }

    @Transactional
    public CartResponseDTO removePostFromCart(String userId, Long postId) {
        cartRepository.findByUser_UserIdAndPost_PostId(userId, postId)
                .ifPresentOrElse(
                        cartRepository::delete,
                        () -> {
                            throw new EntityNotFoundException("Post not found");
                        }
                );

        List<CartEntity> updatedCart = cartRepository.findByUser_UserId(userId);
        return mapEntitiesToResponse(updatedCart);
    }

    @Transactional
    public void clearAllCart(String userId) {
        List<CartEntity> cartItems = cartRepository.findByUser_UserId(userId);
        cartRepository.deleteAll(cartItems);
    }

}
