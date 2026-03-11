package com.new_cafe.app.backend.order.application.port.in;

import com.new_cafe.app.backend.order.domain.Order;
import java.util.List;

public interface OrderUseCase {
    Order placeOrder(PlaceOrderCommand command);
    List<Order> getOrdersByNickname(String nickname);

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
