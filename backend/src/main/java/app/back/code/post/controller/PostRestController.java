package app.back.code.post.controller;

import app.back.code.post.dto.PostDTO;
import app.back.code.post.service.PostService;
import app.back.code.security.dto.UserSecureDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostRestController {

    private final PostService postService;

    @GetMapping("/list")
    public ResponseEntity<Page<PostDTO>> getPostList(@RequestParam(defaultValue = "0")int currentPage,
                                                     @RequestParam(required = false)List<Long> categoryIds,
                                                     @RequestParam(required = false)List<Long> fileTypeIds
                                                     ) {
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<PostDTO> list = postService.getPostList(categoryIds, fileTypeIds, pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDTO> write(
            @Valid @RequestPart("post") PostDTO request,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @AuthenticationPrincipal UserSecureDTO userSecureDTO
    ) {
        String writerId = userSecureDTO.getUserId();
        PostDTO createdPost = postService.createPost(request, writerId, files);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostDetail(@PathVariable("postId") Long postId) {
        PostDTO post = postService.getPost(postId);

        return ResponseEntity.ok(post);
    }

    @PutMapping(value = "/{postId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDTO> update(@PathVariable("postId")Long postId,
                                          @Valid @RequestPart("post") PostDTO request,
                                          @AuthenticationPrincipal UserSecureDTO userSecureDTO,
                                          @RequestPart(value = "files", required = false) List<MultipartFile> files){

        String userId = userSecureDTO.getUserId();

        PostDTO updatedPost = postService.updatePost(postId, request, userId, files);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable("postId") Long postId,
                                       @AuthenticationPrincipal UserSecureDTO userSecureDTO) {
        String userId = userSecureDTO.getUserId();
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }


}
