package app.back.code.security.entity;

import app.back.code.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name="tb_user")
public class UserEntity extends BaseEntity {
    
    @Id
    private String userId;

    private String passwd;

    private String names;

    private String birth;

    private String gender;

    private String phone;

    private String email;

    private String addr;

    private String addrDetail;

    @Column( columnDefinition = "CHAR(1)")
    private String useYn;
    @Column( columnDefinition = "CHAR(1)")
    @ColumnDefault("N")
    private String delYn;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="roles")
    private UserRoleEntity role;

}
