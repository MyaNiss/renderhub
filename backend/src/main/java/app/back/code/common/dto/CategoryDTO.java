package app.back.code.common.dto;

import app.back.code.common.entity.CategoryEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CategoryDTO {
    private Long categoryId;
    private String categoryType;
    private String name;

    public static CategoryDTO fromEntity(CategoryEntity entity) {
        if(entity == null){
            return null;
        }

        return CategoryDTO.builder()
                .categoryId(entity.getCategoryId())
                .categoryType(entity.getCategoryType())
                .name(entity.getName())
                .build();
    }
}
