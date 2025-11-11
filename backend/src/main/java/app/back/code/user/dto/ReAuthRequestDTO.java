package app.back.code.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReAuthRequestDTO {

    @NotBlank
    private String userId;
    @NotBlank
    private String password;
}
