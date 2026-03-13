package com.new_cafe.app.backend.menu.adapter.out.persistence;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.hibernate.annotations.Immutable;

import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuOptionEntity;
import com.new_cafe.app.backend.menu.domain.Menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "UserMenu")
@Table(name = "menus")
@Immutable
@Getter
@NoArgsConstructor
public class MenuEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    private String slug;

    private String description;

    private Integer price;

    @Column(name = "category_id", insertable = false, updatable = false)
    private Long categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "created_at")
    private java.time.LocalDateTime createdAt;

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt;

    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", insertable = false, updatable = false)
    @OrderBy("sortOrder ASC")
    private List<MenuOptionEntity> options = new ArrayList<>();

    public Menu toDomain(String imageSrc) {
        String categoryName = (category != null) ? category.getName() : "미지정";

        List<Menu.MenuOptionInfo> optionInfos = (options != null) ? options.stream()
                .map(o -> Menu.MenuOptionInfo.builder()
                        .id(o.getId())
                        .name(o.getName())
                        .type(o.getType())
                        .required(o.getIsRequired())
                        .sortOrder(o.getSortOrder())
                        .items(o.getItems() != null ? o.getItems().stream()
                                .map(i -> Menu.OptionItemInfo.builder()
                                        .id(i.getId())
                                        .name(i.getName())
                                        .priceDelta(i.getPriceDelta())
                                        .sortOrder(i.getSortOrder())
                                        .build())
                                .collect(Collectors.toList()) : new ArrayList<>())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        return Menu.builder()
                .id(id)
                .korName(korName)
                .engName(engName)
                .slug(slug)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .categoryName(categoryName)
                .isAvailable(isAvailable != null ? isAvailable : true)
                .imageSrc(imageSrc != null ? imageSrc : "blank.png")
                .sortOrder(sortOrder)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .options(optionInfos)
                .build();
    }
}

