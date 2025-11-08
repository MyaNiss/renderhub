package app.back.code.post.service;

import app.back.code.article.repository.CategoryRepository;
import app.back.code.common.entity.CategoryEntity;
import app.back.code.post.dto.PostDTO;
import app.back.code.post.entity.PostEntity;
import app.back.code.post.repository.PostRepository;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final FileService fileService;

    //3D 게시물 검색
    public Page<PostDTO> getPostList(List<Long> categoryIds, List<Long> fileTypeIds, Pageable pageable) {
        Page<PostEntity> posts;

        // 1. categoryIds와 fileTypeIds 둘 다 존재할 때
        if (categoryIds != null && !categoryIds.isEmpty()
                && fileTypeIds != null && !fileTypeIds.isEmpty()) {
            posts = postRepository.findByCategory_CategoryIdInAndFileType_CategoryIdIn(categoryIds, fileTypeIds, pageable);
        }
        // 2. categoryIds만 있을 때
        else if (categoryIds != null && !categoryIds.isEmpty()) {
            posts = postRepository.findByCategory_CategoryIdIn(categoryIds, pageable);
        }
        // 3. fileTypeIds만 있을 때
        else if (fileTypeIds != null && !fileTypeIds.isEmpty()) {
            posts = postRepository.findByFileType_CategoryIdIn(fileTypeIds, pageable);
        }
        // 4. 아무것도 없을 때
        else {
            posts = postRepository.findAll(pageable);
        }

        return posts.map(PostDTO::fromEntity);
    }

    public PostDTO createPost(PostDTO request, String writerId, List<MultipartFile> files) {

        UserAccountEntity writer = userRepository.findById(writerId)
                .orElseThrow(() -> new EntityNotFoundException("작성자를 찾을 수 없습니다."));

        CategoryEntity category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다"));
        CategoryEntity fileType = categoryRepository.findById(request.getFileTypeId()).orElseThrow(() -> new EntityNotFoundException("파일형식을 찾을 수 없습니다"));

        PostEntity newPost = PostEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .writer(writer)
                .category(category)
                .fileType(fileType)
                .build();
        postRepository.save(newPost);

//      fileService 확인 후 변경 예정.
        if (files != null && !files.isEmpty()) {
            fileService.saveFiles(newPost, files);
        }

        return PostDTO.fromEntity(newPost);
    }

    @Transactional
    public PostDTO getPost(Long postId) {
        PostEntity post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        post.increaseViewCount();

        return PostDTO.fromEntity(post);
    }

    @Transactional
    public PostDTO updatePost(Long postId, PostDTO request,  String userId, List<MultipartFile> files) {
        PostEntity post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if(!post.getWriter().getUserId().equals(userId)){
            throw new IllegalArgumentException("게시글 수정 권한이 없습니다");
        }

        post.update(
             request.getTitle(),
             request.getContent(),
             request.getPrice()
        );

//        fileService 확인 후 변경 예정.
        if (files != null && !files.isEmpty()) {
            fileService.replaceFiles(post, files); // 새 파일로 교체
        }

        return PostDTO.fromEntity(post);
    }

    @Transactional
    public void deletePost(Long postId, String userId) {
        PostEntity post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if(!post.getWriter().getUserId().equals(userId)){
            throw new IllegalArgumentException("게시글 삭제 권한이 없습니다");
        }

        postRepository.delete(post);
    }


}
