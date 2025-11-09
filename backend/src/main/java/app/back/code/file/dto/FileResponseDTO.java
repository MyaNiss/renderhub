package app.back.code.file.dto;

import app.back.code.file.entity.FileEntity;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class FileResponseDTO {

    private Long fileId;
    private String originalName;
    private String publicUrl;
    private String fileUseType;
    private Integer displayOrder;

    public static FileResponseDTO fromEntity(FileEntity entity, String publicUrl){
        return FileResponseDTO.builder()
                .fileId(entity.getFileId())
                .originalName(entity.getOriginalName())
                .publicUrl(publicUrl)
                .fileUseType(entity.getFileUseType())
                .displayOrder(entity.getDisplayOrder())
                .build();
    }
}
