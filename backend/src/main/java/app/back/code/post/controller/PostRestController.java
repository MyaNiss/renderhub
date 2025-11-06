package app.back.code.post.controller;

import app.back.code.post.dto.PostDTO;
import app.back.code.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/post")
@RequiredArgsConstructor
public class PostRestController {

    private final PostService postService;

    @GetMapping("/list")
    public ResponseEntity<Page<PostDTO>> getPostList(@RequestParam(defaultValue = "0")int currentPage, @RequestParam(required = false)List<Long> categories) {
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<PostDTO> list = postService.getPostService(categories, pageable);

        return ResponseEntity.ok(list);
    }


}
