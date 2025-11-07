package app.back.code.transaction.repository;

import app.back.code.transaction.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    List<CartEntity> findByUser_UserId(String userId);

    void deleteByIdIn(List<Long> cartIds);

    List<CartEntity> findByUser_UserIdAndPost_PostIdIn(String currentUserId, List<Long> postIds);
}
