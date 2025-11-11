package app.back.code.common.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SimplePostDTO {
    private Long id;
    private String title;

    public SimplePostDTO(Long id, String title) {
        this.id = id;
        this.title = title;
    }
}
