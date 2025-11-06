package app.back.code.comment.entity;

import app.back.code.common.entity.BaseEntity;
import app.back.code.user.entity.UserAccountEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "comment")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@DynamicUpdate
@ToString(callSuper = true)
@EntityListeners(AuditingEntityListener.class)
public class CommentEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "writer_id", nullable = false)
    private UserAccountEntity writer;

    @Column(name = "target_type", length = 10, nullable = false)
    private String targetType;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "content", length = 500, nullable = false)
    private String content;

    @Builder
    public CommentEntity(UserAccountEntity writer, String targetType, Long targetId, String content) {
        this.writer = writer;
        this.targetType = targetType;
        this.targetId = targetId;
        this.content = content;
    }

    public void updateContent(String content) {
        this.content = content;
    }
}
