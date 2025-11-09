package app.back.code.file.repository;

import app.back.code.file.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends JpaRepository<FileEntity,Long> {
    List<FileEntity> findByPost_PostIdAndFileUseTypeOrderByDisplayOrderAsc(Long postId, String fileUseType);

    List<FileEntity> findByStoredPathInAndArticleIsNull(List<String> storedPaths);

    List<FileEntity> findByPost_PostId(Long postId);
}
