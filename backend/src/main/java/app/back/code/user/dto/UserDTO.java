package app.back.code.user.dto;

import app.back.code.common.dto.SimplePostDTO;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.entity.UserRoleEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class UserDTO {

    @NotBlank(message = "아이디는 필수항목입니다")
    @Size(min = 4, max = 50)
    private String userId;

    @NotBlank(message = "닉네임은 필수항목입니다")
    @Size(max = 30)
    private String nickname;

    private String name;

    @Email(message = "유효하지 않은 이메일 형식입니다")
    @NotBlank(message = "이메일은 필수항목입니다")
    private String email;

    private String phone;

    private String contents;

    private String password;

    private String roleName;
    private Boolean isDeleted;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registDate;

    private String bankName;
    private String accountNumber;
    private String accountHolder;

    private List<SimplePostDTO> postList;
    private List<SimplePostDTO> articleList;

    public UserAccountEntity toEntity(UserRoleEntity role, String encryptedPassword){
        return UserAccountEntity.builder()
                .userId(this.userId)
                .password(encryptedPassword)
                .nickname(this.nickname)
                .name(this.name)
                .email(this.email)
                .phone(this.phone)
                .contents(this.contents)
                .role(role)
                .build();
    }

    public static UserDTO from(UserAccountEntity entity) {
        return UserDTO.builder()
                .userId(entity.getUserId())
                .nickname(entity.getNickname())
                .name(entity.getName())
                .email(entity.getEmail())
                .phone(entity.getPhone())
                .contents(entity.getContents())
                .roleName(entity.getRole().getName())
                .isDeleted(entity.isDeleted())
                .registDate(entity.getRegistDate())
                .password(null)
                .build();
    }
}
