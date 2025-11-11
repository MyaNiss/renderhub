package app.back.code.article.service;

import app.back.code.article.DTO.ArticleDTO;
import app.back.code.article.entity.ArticleEntity;
import app.back.code.article.entity.ArticleType;
import app.back.code.article.repository.ArticleRepository;
import app.back.code.common.entity.CategoryEntity;
import app.back.code.common.repository.CategoryRepository;
import app.back.code.common.utils.HtmlParserUtils;
import app.back.code.file.service.FileService;
import app.back.code.user.entity.UserAccountEntity;
import app.back.code.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {

    private final ArticleRepository articleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileService fileService;
    private final HtmlParserUtils htmlParserUtils;

    public Page<ArticleDTO> getArticleList(ArticleType articleType, List<Long> categoryIds, Pageable pageable){
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("articleId").descending()
        );

        Page<ArticleEntity> articles;

        if(categoryIds != null && !categoryIds.isEmpty()){

            articles = articleRepository.findByTypeAndCategory_CategoryIdIn(articleType, categoryIds, sortedPageable);
        } else {
            articles = articleRepository.findByType(articleType, sortedPageable);
        }

        return articles.map(ArticleDTO::fromEntity);
    }

    @Transactional
    public ArticleDTO createArticle(ArticleDTO request, String writerId) {
        UserAccountEntity writer = userRepository.findById(writerId).orElseThrow(() -> new EntityNotFoundException("작성자를 찾을 수 없습니다"));

        CategoryEntity category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다"));

        ArticleEntity newArticle = ArticleEntity.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .writer(writer)
                .category(category)
                .type(request.getType())
                .isSecret(request.getIsSecret())
                .build();

        articleRepository.save(newArticle);

        List<String> storedPaths = HtmlParserUtils.extractImagePathsFromHtml(request.getContent());

        if(!storedPaths.isEmpty()){
            fileService.mapTempQuillImagesToArticle(newArticle.getArticleId(), storedPaths, writerId);
        }

        return ArticleDTO.fromEntity(newArticle);
    }

    @Transactional
    public ArticleDTO getArticle(Long articleId) {
        ArticleEntity article = articleRepository.findById(articleId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        article.increaseViewCount();

        return ArticleDTO.fromEntity(article);
    }

    @Transactional
    public ArticleDTO updateArticle(Long articleId, ArticleDTO request, String userId) {
        ArticleEntity article = articleRepository.findById(articleId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if(!article.getWriter().getUserId().equals(userId)){
            throw new IllegalArgumentException("게시글 수정 권한이 없습니다");
        }

        CategoryEntity newCategory = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("카테고리를 찾을 수 없습니다"));

        article.update(
                request.getTitle(),
                request.getContent(),
                newCategory,
                request.getIsSecret()
        );

        return ArticleDTO.fromEntity(article);
    }

    @Transactional
    public void deleteArticle(Long articleId, String userId) {
        ArticleEntity article = articleRepository.findById(articleId).orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다"));

        if(!article.getWriter().getUserId().equals(userId)){
            throw new IllegalArgumentException("게시글 삭제 권한이 없습니다");
        }

        articleRepository.delete(article);
    }
}
