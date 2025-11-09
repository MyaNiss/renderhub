package app.back.code.transaction.controller;

import app.back.code.security.dto.UserSecureDTO;
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
            @AuthenticationPrincipal UserSecureDTO userSecureDTO) {
        String userId = userSecureDTO.getUserId();
        CartResponseDTO cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    @PostMapping
    public ResponseEntity<CartResponseDTO> addCartItem(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @RequestBody Long postId) {
        if(postId == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        String userId = userSecureDTO.getUserId();
        CartResponseDTO updatedCart = cartService.addPostToCart(userId, postId);
        return new ResponseEntity<>(updatedCart, HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<CartResponseDTO> removeCartItem(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @RequestBody Long postId) {
        String userId = userSecureDTO.getUserId();
        CartResponseDTO updatedCart = cartService.removePostFromCart(userId, postId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/all")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO) {
        String userId = userSecureDTO.getUserId();
        cartService.clearAllCart(userId);
        return ResponseEntity.noContent().build();
    }
}
