package com.new_cafe.app.backend.order.adapter.out.persistence;

import com.new_cafe.app.backend.order.domain.OrderItem;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cafe_order_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @Setter
    private OrderEntity order;

    @Column(nullable = false)
    private Long menuId;

    @Column(nullable = false)
    private String menuName;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer quantity;

    public OrderItemEntity(Long menuId, String menuName, Integer price, Integer quantity) {
        this.menuId = menuId;
        this.menuName = menuName;
        this.price = price;
        this.quantity = quantity;
    }

    public OrderItem toDomain() {
        return OrderItem.builder()
                .id(id)
                .menuId(menuId)
                .menuName(menuName)
                .price(price)
                .quantity(quantity)
                .build();
    }
}
