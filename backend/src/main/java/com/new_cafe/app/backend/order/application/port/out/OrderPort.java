package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.domain.Order;
import java.util.List;

import java.util.Optional;

public interface OrderPort {
    Order save(Order order);
    List<Order> findByNickname(String nickname);
    List<Order> findAll();
    Optional<Order> findById(Long id);
}
