package app.back.code.user.entity;

import app.back.code.common.entity.SoftDeleteEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_account")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true, exclude = {"password"})
@EntityListeners(AuditingEntityListener.class)
public class UserAccountEntity extends SoftDeleteEntity {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private UserRoleEntity role;

    @Setter
    @Column(name = "password", nullable = false)
    private String password;

    @Setter
    @Column(name = "name", length = 30, nullable = false)
    private String name;

    @Setter
    @Column(name = "nickname", length = 30, nullable = false)
    private String nickname;

    @Setter
    @Column(name = "phone", length = 20)
    private String phone;

    @Setter
    @Column(name = "email", length = 50, nullable = false, unique = true)
    private String email;

    @Setter
    @Lob
    @Column(name = "contents", columnDefinition = "TEXT")
    private String contents = "";

    @CreatedDate
    @Column(name = "regist_date", nullable = false, updatable = false)
    private LocalDateTime registDate;


    @Builder
    public UserAccountEntity(String userId, UserRoleEntity role, String password, String name, String nickname, String phone, String email, String contents) {
        this.userId = userId;
        this.role = role;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.phone = phone;
        this.email = email;
        this.contents = contents != null ? contents : "";
    }

}
