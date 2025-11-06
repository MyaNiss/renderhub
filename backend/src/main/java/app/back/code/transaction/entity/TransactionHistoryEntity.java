package app.back.code.transaction.entity;

import app.back.code.common.entity.CreatedAtEntity;
import app.back.code.post.entity.PostEntity;
import app.back.code.user.entity.UserAccountEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "transaction_history")
@IdClass(TransactionHistoryId.class)
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true, exclude = {"user", "post", "order"})
@EntityListeners(AuditingEntityListener.class)
public class TransactionHistoryEntity extends CreatedAtEntity {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccountEntity user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private PostEntity post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private UserOrderEntity order;

    @Builder
    public TransactionHistoryEntity(UserAccountEntity user, PostEntity post, UserOrderEntity order) {
        this.user = user;
        this.post = post;
        this.order = order;
    }
}
