package app.back.code.user.entity;

import app.back.code.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "user_bank")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true, exclude = "user")
@EntityListeners(AuditingEntityListener.class)
public class UserBankEntity extends BaseEntity {

    @Id
    @Column(name = "user_id", length = 50)
    private String userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserAccountEntity user;

    @Setter
    @Column(name = "bank_name", length = 50, nullable = false)
    private String bankName;

    @Setter
    @Column(name = "account_number", length = 100, nullable = false)
    private String accountNumber;

    @Setter
    @Column(name = "account_holder", length = 50, nullable = false)
    private String accountHolder;

    @Builder
    public UserBankEntity(UserAccountEntity user, String bankName, String accountNumber, String accountHolder) {
        this.user =  user;
        this.userId = user.getUserId();
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
    }

    public void updateBankInfo(String bankName, String accountNumber, String accountHolder) {
        this.bankName = bankName;
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
    }
}
