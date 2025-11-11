package app.back.code.transaction.controller;

import app.back.code.security.dto.UserSecureDTO;
import app.back.code.transaction.dto.CartRequestDTO;
import app.back.code.transaction.dto.CartResponseDTO;
import app.back.code.transaction.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartRestController {
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(
            @AuthenticationPrincipal String userId) {
        CartResponseDTO cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<CartResponseDTO> addCartItem(
            @AuthenticationPrincipal String userId,
            @RequestBody CartRequestDTO cartRequestDTO) {

        CartResponseDTO updatedCart = cartService.addPostToCart(userId, cartRequestDTO.getPostId());
        return new ResponseEntity<>(updatedCart, HttpStatus.CREATED);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<CartResponseDTO> removeCartItem(
            @AuthenticationPrincipal String userId,
            @PathVariable Long postId) {
        CartResponseDTO updatedCart = cartService.removePostFromCart(userId, postId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal String userId) {
        cartService.clearAllCart(userId);
        return ResponseEntity.noContent().build();
    }
}
