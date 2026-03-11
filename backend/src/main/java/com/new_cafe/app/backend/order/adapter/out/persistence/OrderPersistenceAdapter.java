package com.new_cafe.app.backend.order.adapter.out.persistence;

import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.domain.Order;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class OrderPersistenceAdapter implements OrderPort {

    private final OrderJpaRepository orderJpaRepository;

    @Override
    public Order save(Order order) {
        OrderEntity entity = new OrderEntity(
                order.getNickname(),
                order.getTotalPrice(),
                order.getStatus() != null ? order.getStatus() : OrderStatus.PENDING
        );

        order.getItems().forEach(item -> {
            OrderItemEntity itemEntity = new OrderItemEntity(
                    item.getMenuId(),
                    item.getMenuName(),
                    item.getPrice(),
                    item.getQuantity()
            );
            entity.addItem(itemEntity);
        });

        OrderEntity savedEntity = orderJpaRepository.save(entity);
        return savedEntity.toDomain();
    }

    @Override
    public List<Order> findByNickname(String nickname) {
        return orderJpaRepository.findByNicknameOrderByOrderTimeDesc(nickname).stream()
                .map(OrderEntity::toDomain)
                .collect(Collectors.toList());
    }
}
