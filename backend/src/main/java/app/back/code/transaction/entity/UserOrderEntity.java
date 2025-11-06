package app.back.code.transaction.entity;

import app.back.code.common.entity.CreatedAtEntity;
import app.back.code.user.entity.UserAccountEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "user_order")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true)
@EntityListeners(AuditingEntityListener.class)
public class UserOrderEntity extends CreatedAtEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccountEntity user;

    @Column(name = "total_price", nullable = false)
    private Long totalPrice;

    @Setter
    @Column(name = "status", length = 20, nullable = false)
    private String status;

    @Column(name = "toss_order_id", length = 255)
    private String tossOrderId;
}
