package app.back.code.transaction.repository;

import app.back.code.transaction.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItemEntity,Long> {

    List<OrderItemEntity> findByOrder_OrderId(Long orderId);
}
