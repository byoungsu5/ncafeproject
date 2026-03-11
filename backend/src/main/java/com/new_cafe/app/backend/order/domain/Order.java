package com.new_cafe.app.backend.order.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    private Long id;
    private String nickname; // 주문자 닉네임
    private List<OrderItem> items;
    private Integer totalPrice;
    private OrderStatus status;
    private LocalDateTime orderTime;
}
