package com.new_cafe.app.backend.order.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderJpaRepository extends JpaRepository<OrderEntity, Long> {
    List<OrderEntity> findByNicknameOrderByOrderTimeDesc(String nickname);
    List<OrderEntity> findAllByOrderByOrderTimeDesc();

    @Query("SELECT COUNT(o) FROM OrderEntity o WHERE o.status <> 'CANCELLED'")
    long countNonCancelledOrders();

    @Query("SELECT SUM(o.totalPrice) FROM OrderEntity o WHERE o.status = com.new_cafe.app.backend.order.domain.OrderStatus.COMPLETED")
    Long sumTotalRevenue();

    @Query("SELECT SUM(i.quantity) FROM OrderItemEntity i JOIN i.order o WHERE o.status = com.new_cafe.app.backend.order.domain.OrderStatus.COMPLETED")
    Long sumTotalSalesVolume();

    @Query(value = "SELECT to_char(o.order_time, 'YYYY-MM-DD') as stat_date, " +
           "count(*) as order_count, " +
           "sum(case when o.status = 'COMPLETED' then o.total_price else 0 end) as daily_revenue, " +
           "sum(case when o.status = 'COMPLETED' then coalesce(i.total_qty, 0) else 0 end) as daily_sales_volume " +
           "FROM cafe_orders o " +
           "LEFT JOIN (SELECT order_id, sum(quantity) as total_qty FROM cafe_order_items GROUP BY order_id) i ON o.id = i.order_id " +
           "WHERE o.order_time IS NOT NULL AND o.order_time >= CURRENT_DATE - INTERVAL '7 days' " +
           "GROUP BY to_char(o.order_time, 'YYYY-MM-DD') " +
           "ORDER BY stat_date", nativeQuery = true)
    List<Object[]> findDailyStats();
}
