package app.back.code.transaction.repository;

import app.back.code.transaction.entity.UserOrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserOrderRepository extends JpaRepository<UserOrderEntity, Long> {

    List<UserOrderEntity> findByUser_UserId(String userId);

    Optional<UserOrderEntity> findByTossOrderCode(String tossOrderCode);
}
