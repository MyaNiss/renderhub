package app.back.code.user.controller;

import app.back.code.common.dto.ApiResponse;
import app.back.code.user.dto.PasswordUpdateDTO;
import app.back.code.user.dto.ReAuthRequestDTO;
import app.back.code.user.dto.UserDTO;
import app.back.code.user.service.UserBankService;
import app.back.code.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/user")
public class UserRestController {

    private final UserService userService;
    private final UserBankService userBankService;

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserDTO>> getPrivateUser(@PathVariable String userId) {
        UserDTO response = userService.findPrivateUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{userId}/public")
    public ResponseEntity<ApiResponse<UserDTO>> getPublicUser(@PathVariable String userId) {
        UserDTO response = userService.findPublicUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> registerUser(@RequestBody @Valid UserDTO requestDTO) {
        UserDTO response = userService.saveUser(requestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response));
    }

    @PostMapping("/reAuth")
    public ResponseEntity<ApiResponse<Void>> reAuthenticate(@Valid @RequestBody ReAuthRequestDTO requestDTO) {
        boolean isAuthenticated = userService.reAuthenticate(
                requestDTO.getUserId(),
                requestDTO.getPassword()
        );

        if(isAuthenticated) {
            return ResponseEntity.ok(ApiResponse.ok(null));
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/password")
    public ResponseEntity<ApiResponse<Void>> updatePassword(@AuthenticationPrincipal String currentUserId,
                                                            @RequestBody @Valid PasswordUpdateDTO passwordUpdateDTO) {

        userService.updatePassword(
                currentUserId,
                passwordUpdateDTO.getCurrentPassword(),
                passwordUpdateDTO.getNewPassword()
        );

        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDTO>> updateUser(@AuthenticationPrincipal String currentUserId, @RequestBody @Valid UserDTO requestDTO) {
        UserDTO updatedUser = userService.updateUser(currentUserId, requestDTO);

        if(requestDTO.getBankName() != null || requestDTO.getAccountNumber() != null) {
            userBankService.saveOrUpdateBankInfo(currentUserId, requestDTO);
        }

        return ResponseEntity.ok(ApiResponse.ok(updatedUser));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<UserDTO>> deleteUser(@AuthenticationPrincipal String currentUserId) {
        userService.deleteUser(currentUserId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.ok(null));
    }
}
