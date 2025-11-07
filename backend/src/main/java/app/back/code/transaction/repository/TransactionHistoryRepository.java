package app.back.code.transaction.repository;

import app.back.code.transaction.entity.TransactionHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionHistoryRepository extends JpaRepository<TransactionHistoryEntity,Long> {

    List<TransactionHistoryEntity> findByUser_UserIdOrderByCreatedAtDesc(String userId);

    List<TransactionHistoryEntity> findByPost_PostId(Long postId);
}
