package com.new_cafe.app.backend.order.application.port.out;

import com.new_cafe.app.backend.order.domain.Order;
import java.util.List;

public interface OrderPort {
    Order save(Order order);
    List<Order> findByNickname(String nickname);
}
