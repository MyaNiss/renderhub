package app.back.code.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateDTO {

    @NotBlank(message = "현재 비밀번호는 필수 항목입니다")
    private String currentPassword;

    @NotBlank(message = "새 비밀번호는 필수 항목입니다")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하여야 합니다")
    private String newPassword;

    @NotBlank
    private String confirmNewPassword;


}
