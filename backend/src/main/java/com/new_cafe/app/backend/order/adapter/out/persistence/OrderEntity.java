package com.new_cafe.app.backend.order.adapter.out.persistence;

import com.new_cafe.app.backend.order.domain.Order;
import com.new_cafe.app.backend.order.domain.OrderStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "cafe_orders")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class OrderEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long id;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private Integer totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime orderTime;

    public OrderEntity(String nickname, Integer totalPrice, OrderStatus status) {
        this.nickname = nickname;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public void addItem(OrderItemEntity item) {
        this.items.add(item);
        item.setOrder(this);
    }

    public Order toDomain() {
        return Order.builder()
                .id(id)
                .nickname(nickname)
                .items(items.stream().map(OrderItemEntity::toDomain).collect(Collectors.toList()))
                .totalPrice(totalPrice)
                .status(status)
                .orderTime(orderTime)
                .build();
    }
}
