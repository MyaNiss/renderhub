package app.back.code.transaction.repository;

import app.back.code.transaction.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {

    @Query("SELECT c FROM CartEntity c JOIN FETCH c.post p WHERE c.user.userId = :userId")
    List<CartEntity> findByUser_UserId(String userId);

    void deleteByIdIn(List<Long> cartIds);

    Optional<CartEntity> findByUser_UserIdAndPost_PostId(String userId, Long postId);

    List<CartEntity> findByUser_UserIdAndPost_PostIdIn(String currentUserId, List<Long> postIds);
}
