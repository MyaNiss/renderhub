package app.back.code.article.controller;

import app.back.code.article.DTO.ArticleDTO;
import app.back.code.article.entity.ArticleType;
import app.back.code.article.service.ArticleService;
import app.back.code.common.dto.ApiResponse;
import app.back.code.security.dto.UserSecureDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cs")
@RequiredArgsConstructor
public class CsRestController {

    private final ArticleService articleService;

    @GetMapping("/list")
    public ResponseEntity<Page<ArticleDTO>> getCsList(@RequestParam(defaultValue = "0")int currentPage,
                                                                   @RequestParam(required = false)List<Long> categoryId) {
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<ArticleDTO> list = articleService.getArticleList(ArticleType.CS, categoryId, pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> write(@Valid ArticleDTO request,
                                            @AuthenticationPrincipal String userId){
        ArticleDTO newArticle = ArticleDTO.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .isSecret(request.getIsSecret())
                .type(ArticleType.CS)
                .build();

        ArticleDTO createdArticle = articleService.createArticle(newArticle, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);
    }

    @GetMapping("/{csId}")
    public ResponseEntity<ArticleDTO> getCsDetail(@PathVariable("csId") Long csId){
        ArticleDTO article = articleService.getArticle(csId);

        if(article.getType() != ArticleType.CS){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(article);
    }

    @PutMapping("/{csId}")
    public ResponseEntity<ApiResponse<ArticleDTO>> update(@PathVariable("csId")Long csId,
                                             @Valid ArticleDTO request,
                                             @AuthenticationPrincipal String userId){

        ArticleDTO updatedArticle = articleService.updateArticle(csId, request, userId);
        return ResponseEntity.ok(ApiResponse.ok(updatedArticle));
    }

    @DeleteMapping("/{csId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable("csId") Long csId,
                                       @AuthenticationPrincipal String userId){
        articleService.deleteArticle(csId, userId);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
