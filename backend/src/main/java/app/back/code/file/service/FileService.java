package app.back.code.file.service;

import app.back.code.article.entity.ArticleEntity;
import app.back.code.file.entity.FileEntity;
import app.back.code.file.repository.FileRepository;
import app.back.code.post.entity.PostEntity;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileRepository fileRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional
    public String uploadQuillImage(String userId, MultipartFile file, String fileUseType) {
        if(file.isEmpty()){
            throw new IllegalArgumentException("업로드할 파일이 없습니다");
        }

        UserAccountEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다"));

        String storedPath = null;

        try {
            storedPath = storageService.saveFile(file, fileUseType);
            String publicUrl = storageService.getPublicUrl(storedPath);

            FileEntity fileEntity = FileEntity.builder()
                    .fileUseType(fileUseType)
                    .originalName(file.getOriginalFilename())
                    .storedPath(storedPath)
                    .displayOrder(null)
                    .post(null)
                    .article(null)
                    .build();

            fileRepository.save(fileEntity);

            return publicUrl;
        } catch (Exception e) {
            if(storedPath != null) {
                try {
                    storageService.deleteFile(storedPath);
                } catch (Exception deleteException) {

                }
            }
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public FileEntity savePostFile(PostEntity post, MultipartFile file, String fileUseType, String subDirName, Integer displayOrder) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }

        try {
            String storedPath = storageService.saveFile(file, fileUseType, subDirName);

            FileEntity fileEntity = FileEntity.builder()
                    .fileUseType(fileUseType)
                    .originalName(file.getOriginalFilename())
                    .storedPath(storedPath)
                    .displayOrder(displayOrder)
                    .post(post)
                    .article(null)
                    .build();

            return fileRepository.save(fileEntity);

        } catch (Exception e) {
            throw new RuntimeException("Post 파일 업로드 및 메타데이터 저장 실패", e);
        }
    }

    @Transactional
    public void mapTempQuillImagesToArticle(Long articleId, List<String> storedPaths, String writerId) {
        if (storedPaths.isEmpty()) {
            return;
        }

        List<FileEntity> tempFiles = fileRepository.findByStoredPathInAndArticleIsNull(storedPaths);

        ArticleEntity articleRef = new ArticleEntity(articleId);

        for (FileEntity file : tempFiles) {

            file.setArticle(articleRef);
            fileRepository.save(file);
        }

    }

    @Transactional
    public void replacePostFiles(PostEntity post, List<String> existingImageUrls, boolean keepExistingFile, List<MultipartFile> newImageFiles, MultipartFile newProductFile, String subDirName) {
        Long postId = post.getPostId();

        final List<String> finalExistingImageUrls =
                (existingImageUrls == null) ? Collections.emptyList() : existingImageUrls;

        List<FileEntity> allExistingFiles = fileRepository.findByPost_PostId(postId);

        List<FileEntity> productFiles = allExistingFiles.stream()
                .filter(f -> "POST_FILE".equals(f.getFileUseType()))
                .collect(Collectors.toList());

        List<FileEntity> imageFiles = allExistingFiles.stream()
                .filter(f -> "POST_IMG".equals(f.getFileUseType()))
                .collect(Collectors.toList());



        if (keepExistingFile && (newProductFile == null || newProductFile.isEmpty())) {
            if (productFiles.isEmpty()) {
                throw new IllegalArgumentException("제품 파일은 필수로 등록해야 합니다. (유지할 파일 없음)");
            }
        }
        else if (newProductFile != null && !newProductFile.isEmpty()) {
            productFiles.forEach(file -> {
                storageService.deleteFile(file.getStoredPath());
                fileRepository.delete(file);
            });

            final String productFileUseType = "POST_FILE";
            this.savePostFile(post, newProductFile, productFileUseType, subDirName, null);
        }
        else {
            throw new IllegalArgumentException("제품 파일은 필수로 등록해야 합니다.");
        }

        List<String> existingFileUrls = imageFiles.stream()
                .map(f -> storageService.getPublicUrl(f.getStoredPath()))
                .collect(Collectors.toList());

        imageFiles.forEach(file -> {
            String publicUrl = storageService.getPublicUrl(file.getStoredPath());
            if (!finalExistingImageUrls.contains(publicUrl)) {
                storageService.deleteFile(file.getStoredPath());
                fileRepository.delete(file);
            }
        });

        if (newImageFiles != null && !newImageFiles.isEmpty()) {
            final String imageFileUseType = "POST_IMG";

            for (int i = 0; i < newImageFiles.size(); i++) {
                MultipartFile image = newImageFiles.get(i);
                if (!image.isEmpty()) {
                    int displayOrder = finalExistingImageUrls.size() + i;
                    this.savePostFile(post, image, imageFileUseType, subDirName, displayOrder);
                }
            }
        }
    }
}
