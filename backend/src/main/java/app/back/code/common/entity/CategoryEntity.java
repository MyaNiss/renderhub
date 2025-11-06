package app.back.code.common.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "category", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"category_type", "name"}, name = "uk_type_name")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class CategoryEntity {

    // 1** = "POST_CATEGORY"
    // 2** = "POST_FILETYPE"
    // 3** = "BOARD_CATEGORY"
    // 4** = "CS_CATEGORY"
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_type", length = 30, nullable = false)
    private String categoryType;

    @Column(name = "name", length = 50, nullable = false)
    private String name;
}
