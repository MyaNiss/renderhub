package app.back.code.common.repository;

import app.back.code.common.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {

    List<CategoryEntity> findByCategoryType(String categoryType);

    CategoryEntity findByCategoryId(Long categoryId);

    CategoryEntity findByCategoryTypeAndName(String categoryType, String name);
}