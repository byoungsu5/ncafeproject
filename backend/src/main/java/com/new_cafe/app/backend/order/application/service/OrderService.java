package com.new_cafe.app.backend.order.application.service;

import com.new_cafe.app.backend.order.application.port.in.OrderUseCase;
import com.new_cafe.app.backend.order.application.port.out.OrderPort;
import com.new_cafe.app.backend.order.domain.Order;
import com.new_cafe.app.backend.order.domain.OrderItem;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService implements OrderUseCase {

    private final OrderPort orderPort;

    @Override
    public Order placeOrder(PlaceOrderCommand command) {
        int totalPrice = command.items().stream()
                .mapToInt(item -> item.price() * item.quantity())
                .sum();

        Order order = Order.builder()
                .nickname(command.nickname())
                .status(OrderStatus.PENDING)
                .totalPrice(totalPrice)
                .items(command.items().stream()
                        .map(item -> OrderItem.builder()
                                .menuId(item.menuId())
                                .menuName(item.menuName())
                                .price(item.price())
                                .quantity(item.quantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();

        return orderPort.save(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByNickname(String nickname) {
        return orderPort.findByNickname(nickname);
    }
}
