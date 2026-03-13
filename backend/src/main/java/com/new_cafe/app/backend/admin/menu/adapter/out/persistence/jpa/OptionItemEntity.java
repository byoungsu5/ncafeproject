package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "AdminOptionItem")
@Table(name = "option_items")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptionItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "option_id", insertable = false, updatable = false)
    private Long optionId;

    private String name;

    @Column(name = "price_delta")
    private Integer priceDelta;

    @Column(name = "sort_order")
    private Integer sortOrder;

    public void update(String name, Integer priceDelta, Integer sortOrder) {
        this.name = name;
        this.priceDelta = priceDelta;
        this.sortOrder = sortOrder;
    }
}
