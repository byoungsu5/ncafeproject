package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.domain.Order;
import java.util.List;

import com.new_cafe.app.backend.order.domain.OrderStatus;

public interface OrderUseCase {
    Order placeOrder(PlaceOrderCommand command);
    List<Order> getOrdersByNickname(String nickname);
    List<Order> getAllOrders();
    Order updateOrderStatus(Long orderId, OrderStatus status);

    record PlaceOrderCommand(
        String nickname,
        List<OrderItemCommand> items
    ) {}

    record OrderItemCommand(
        Long menuId,
        String menuName,
        Integer price,
        Integer quantity
    ) {}
}
