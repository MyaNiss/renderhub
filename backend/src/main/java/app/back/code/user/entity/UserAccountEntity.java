package app.back.code.user.entity;

import jakarta.persistence.*;
import lombok.*;

//@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@Table(name = "user")
public class UserAccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

}
