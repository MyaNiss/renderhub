package app.back.code.post.service;

import app.back.code.article.DTO.ArticleDTO;
import app.back.code.article.repository.CategoryRepository;
import app.back.code.post.dto.PostDTO;
import app.back.code.post.entity.PostEntity;
import app.back.code.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;

    public Page<PostDTO> getPostList(List<Long> categoryIds, Pageable pageable){
        Page<PostEntity> posts;

        return posts.map(PostDTO::fromEntity);
    }
}
