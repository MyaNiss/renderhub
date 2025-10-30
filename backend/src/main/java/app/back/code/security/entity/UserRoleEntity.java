package app.back.code.security.entity;
import app.back.code.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="tb_user_role")
public class UserRoleEntity extends BaseEntity {

    @Id
    private String roleId;

    private String roleName;

}
