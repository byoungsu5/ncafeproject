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

        System.out.println("[OrderService] placeOrder request for: " + command.nickname() + ", total: " + totalPrice + ", items: " + command.items().size());

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

        Order savedOrder = orderPort.save(order);
        System.out.println("[OrderService] Order saved successfully with ID: " + savedOrder.getId());
        return savedOrder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getOrdersByNickname(String nickname) {
        return orderPort.findByNickname(nickname);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderPort.findAll();
    }

    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderPort.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        return orderPort.save(order);
    }
}
