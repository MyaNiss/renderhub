package app.back.code.file.controller;

import app.back.code.file.service.FileService;
import app.back.code.security.dto.UserSecureDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/file")
@RequiredArgsConstructor
public class FileRestController {
    private final FileService fileService;

    @PostMapping("/upload/quill")
    public ResponseEntity<String> uploadQuillImage(
            @AuthenticationPrincipal UserSecureDTO userSecureDTO,
            @RequestPart("file") MultipartFile file) {
        String fileUseType = "ARTICLE_IMG";
        String userId = userSecureDTO.getUserId();

        String imageUrl = fileService.uploadQuillImage(userId, file, fileUseType);

        return ResponseEntity.ok(imageUrl);
    }
}
