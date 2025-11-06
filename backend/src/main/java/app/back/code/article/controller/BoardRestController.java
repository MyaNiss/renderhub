package app.back.code.article.controller;

import app.back.code.article.DTO.ArticleDTO;
import app.back.code.article.entity.ArticleEntity;
import app.back.code.article.entity.ArticleType;
import app.back.code.article.service.ArticleService;
import app.back.code.security.dto.UserSecureDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/board")
@RequiredArgsConstructor
public class BoardRestController {

    private final ArticleService articleService;

    @GetMapping("/list")
    public ResponseEntity<Page<ArticleDTO>> getBoardList(@RequestParam(defaultValue = "0")int currentPage,
                                                         @RequestParam(required = false)List<Long> categories){
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<ArticleDTO> list = articleService.getArticleList(ArticleType.BOARD, categories, pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> write(@Valid ArticleDTO request,
                                            @AuthenticationPrincipal UserSecureDTO userSecureDTO) {
        String writerId = userSecureDTO.getUserId();

        ArticleDTO newArticle = ArticleDTO.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .isSecret(request.getIsSecret())
                .type(ArticleType.BOARD)
                .build();

        ArticleDTO createdArticle = articleService.createArticle(newArticle, writerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<ArticleDTO> getBoardDetail(@PathVariable("boardId") Long boardId){
        ArticleDTO article = articleService.getArticle(boardId);

        if(article.getType() != ArticleType.BOARD){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(article);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<ArticleDTO> update(@PathVariable("boardId")Long boardId,
                                             @Valid ArticleDTO request,
                                             @AuthenticationPrincipal UserSecureDTO userSecureDTO){
        String userId = userSecureDTO.getUserId();

        ArticleDTO updatedArticle = articleService.updateArticle(boardId, request, userId);
        return ResponseEntity.ok(updatedArticle);
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> delete(@PathVariable("boardId") Long boardId,
                                       @AuthenticationPrincipal UserSecureDTO userSecureDTO){
        String userId = userSecureDTO.getUserId();
        articleService.deleteArticle(boardId, userId);
        return ResponseEntity.noContent().build();
    }

}
