package app.back.code.post.controller;

import app.back.code.post.dto.PostDTO;
import app.back.code.post.service.PostService;
import app.back.code.security.dto.UserSecureDTO;
import jakarta.annotation.Nullable;
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
                                                     @RequestParam(required = false)List<Long> fileTypeIds,
                                                     @RequestParam(required = false)String keyword
                                                     ) {
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<PostDTO> list = postService.getPostList(categoryIds, fileTypeIds, keyword, pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDTO> write(
            @Valid @RequestPart("post") PostDTO request,
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles,
            @RequestPart(value = "productFile", required = false) MultipartFile productFile,
            @AuthenticationPrincipal String userId
    ) {
        PostDTO createdPost = postService.createPost(request, userId, imageFiles, productFile);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostDetail(@PathVariable("postId") Long postId,
                                                 @AuthenticationPrincipal @Nullable String userId) {
        PostDTO post = postService.getPost(postId, userId);

        return ResponseEntity.ok(post);
    }

    @GetMapping("recommendations")
    public ResponseEntity<List<PostDTO>> getRecommendedPosts(@RequestParam(value = "limit", defaultValue = "4")int limit){
        List<PostDTO> recommendedPosts = postService.getTopPurchasedItems(limit);
        return ResponseEntity.ok(recommendedPosts);
    }

    @PutMapping(value = "/{postId}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<PostDTO> update(@PathVariable("postId")Long postId,
                                          @Valid @RequestPart("post") PostDTO request,
                                          @AuthenticationPrincipal String userId,
                                          @RequestPart(value = "imageFiles", required = false)List<MultipartFile> imageFiles,
                                          @RequestPart(value = "productFile", required = false)MultipartFile productFile){

        PostDTO updatedPost = postService.updatePost(postId, request, userId, imageFiles, productFile);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable("postId") Long postId,
                                       @AuthenticationPrincipal String userId) {
        postService.deletePost(postId, userId);
        return ResponseEntity.noContent().build();
    }


}
