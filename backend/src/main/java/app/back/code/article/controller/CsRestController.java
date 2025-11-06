package app.back.code.article.controller;

import app.back.code.article.DTO.ArticleDTO;
import app.back.code.article.entity.ArticleType;
import app.back.code.article.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cs")
@RequiredArgsConstructor
public class CsRestController {

    private final ArticleService articleService;

    @GetMapping("/list")
    public ResponseEntity<Page<ArticleDTO>> getCsList(@RequestParam(defaultValue = "0")int currentPage, @RequestParam(required = false)List<Long> categories){
        Pageable pageable = PageRequest.of(currentPage, 10);
        Page<ArticleDTO> list = articleService.getArticleList(ArticleType.CS, categories, pageable);

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> write(@RequestBody ArticleDTO request){
        String writerId = "authenticated_user_id";

        ArticleDTO newArticle = ArticleDTO.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .categoryId(request.getCategoryId())
                .isSecret(request.getIsSecret())
                .type(ArticleType.CS)
                .build();

        ArticleDTO createdArticle = articleService.createArticle(newArticle, writerId);
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
    public ResponseEntity<ArticleDTO> update(@PathVariable("csId")Long csId, @Valid ArticleDTO request){
        String userId = "authenticated_user_id";

        ArticleDTO updatedArticle = articleService.updateArticle(csId, request, userId);
        return ResponseEntity.ok(updatedArticle);
    }

    @DeleteMapping("/{csId}")
    public ResponseEntity<Void> delete(@PathVariable("csId") Long csId){
        String userId = "authenticated_user_id";
        articleService.deleteArticle(csId, userId);
        return ResponseEntity.noContent().build();
    }
}
