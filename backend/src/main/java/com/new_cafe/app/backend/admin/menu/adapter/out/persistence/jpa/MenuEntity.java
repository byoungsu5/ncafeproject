package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.new_cafe.app.backend.admin.menu.domain.Menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.CascadeType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.new_cafe.app.backend.menu.adapter.out.persistence.CategoryEntity;
import com.new_cafe.app.backend.admin.menu.domain.Menu;
import com.new_cafe.app.backend.admin.menu.domain.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.OptionItem;

@Entity(name = "AdminMenu")
@Table(name = "menus")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", insertable = false, updatable = false)
    private CategoryEntity category;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id")
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private java.util.List<MenuOptionEntity> options = new java.util.ArrayList<>();

    public Menu toDomain(String imageSrc) {
        String categoryName = (category != null) ? category.getName() : "미지정";
        return Menu.builder()
                .id(id)
                .korName(korName)
                .engName(engName)
                .slug(slug)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .isAvailable(isAvailable)
                .sortOrder(sortOrder)
                .imageSrc(imageSrc != null ? imageSrc : "blank.png")
                .categoryName(categoryName)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .options(options != null ? options.stream()
                        .map(o -> MenuOption.builder()
                                .id(o.getId())
                                .name(o.getName())
                                .type(o.getType())
                                .isRequired(o.getIsRequired())
                                .sortOrder(o.getSortOrder())
                                .items(o.getItems() != null ? o.getItems().stream()
                                        .map(i -> OptionItem.builder()
                                                .id(i.getId())
                                                .name(i.getName())
                                                .priceDelta(i.getPriceDelta())
                                                .sortOrder(i.getSortOrder())
                                                .build())
                                        .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                                .build())
                        .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                .build();
    }

    public static MenuEntity fromDomain(Menu menu) {
        MenuEntity entity = MenuEntity.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .isAvailable(menu.getIsAvailable())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
        
        if (menu.getOptions() != null) {
            entity.options = menu.getOptions().stream()
                .map(o -> MenuOptionEntity.builder()
                    .id(o.getId())
                    .menuId(menu.getId())
                    .name(o.getName())
                    .type(o.getType())
                    .isRequired(o.getIsRequired())
                    .sortOrder(o.getSortOrder())
                    .items(o.getItems() != null ? o.getItems().stream()
                        .map(i -> OptionItemEntity.builder()
                            .id(i.getId())
                            .optionId(o.getId())
                            .name(i.getName())
                            .priceDelta(i.getPriceDelta())
                            .sortOrder(i.getSortOrder())
                            .build())
                        .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                    .build())
                .collect(java.util.stream.Collectors.toList());
        }
        return entity;
    }
}
