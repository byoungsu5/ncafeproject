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

    public void update(Menu menu) {
        this.korName = menu.getKorName();
        this.engName = menu.getEngName();
        this.slug = menu.getSlug();
        this.description = menu.getDescription();
        this.price = menu.getPrice();
        this.categoryId = menu.getCategoryId();
        this.isAvailable = menu.getIsAvailable();
        this.sortOrder = menu.getSortOrder();
        
        syncOptions(menu.getOptions());
    }
 
    private void syncOptions(java.util.List<com.new_cafe.app.backend.admin.menu.domain.MenuOption> domainOptions) {
        if (domainOptions == null) {
            this.options.clear();
            return;
        }
 
        // 제거될 옵션들 처리
        this.options.removeIf(existingOpt -> {
            boolean stays = domainOptions.stream()
                .anyMatch(domainOpt -> domainOpt.getId() != null && domainOpt.getId().equals(existingOpt.getId()));
            return !stays;
        });

        for (com.new_cafe.app.backend.admin.menu.domain.MenuOption domainOpt : domainOptions) {
            if (domainOpt.getId() != null) {
                // 기존 옵션 업데이트
                this.options.stream()
                    .filter(o -> o.getId().equals(domainOpt.getId()))
                    .findFirst()
                    .ifPresent(existingOpt -> {
                        existingOpt.update(domainOpt.getName(), domainOpt.getType(), domainOpt.getIsRequired(), domainOpt.getSortOrder());
                        syncItems(existingOpt, domainOpt.getItems());
                    });
            } else {
                // 새 옵션 추가
                MenuOptionEntity newOption = MenuOptionEntity.builder()
                        .menuId(this.id)
                        .name(domainOpt.getName())
                        .type(domainOpt.getType())
                        .isRequired(domainOpt.getIsRequired())
                        .sortOrder(domainOpt.getSortOrder())
                        .build();
                syncItems(newOption, domainOpt.getItems());
                this.options.add(newOption);
            }
        }
    }
 
    private void syncItems(MenuOptionEntity optionEntity, java.util.List<com.new_cafe.app.backend.admin.menu.domain.OptionItem> domainItems) {
        if (domainItems == null) {
            optionEntity.getItems().clear();
            return;
        }

        // 제거될 아이템들 처리
        optionEntity.getItems().removeIf(existingItem -> {
            boolean stays = domainItems.stream()
                .anyMatch(domainItem -> domainItem.getId() != null && domainItem.getId().equals(existingItem.getId()));
            return !stays;
        });

        for (com.new_cafe.app.backend.admin.menu.domain.OptionItem domainItem : domainItems) {
            if (domainItem.getId() != null) {
                // 기존 아이템 업데이트
                optionEntity.getItems().stream()
                    .filter(i -> i.getId().equals(domainItem.getId()))
                    .findFirst()
                    .ifPresent(existingItem -> {
                        existingItem.update(domainItem.getName(), domainItem.getPriceDelta(), domainItem.getSortOrder());
                    });
            } else {
                // 새 아이템 추가
                OptionItemEntity newItem = OptionItemEntity.builder()
                        .optionId(optionEntity.getId())
                        .name(domainItem.getName())
                        .priceDelta(domainItem.getPriceDelta())
                        .sortOrder(domainItem.getSortOrder())
                        .build();
                optionEntity.getItems().add(newItem);
            }
        }
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
            java.util.List<MenuOptionEntity> optionEntities = menu.getOptions().stream()
                .map(o -> {
                    MenuOptionEntity optionEntity = MenuOptionEntity.builder()
                        .id(o.getId())
                        .menuId(menu.getId())
                        .name(o.getName())
                        .type(o.getType())
                        .isRequired(o.getIsRequired())
                        .sortOrder(o.getSortOrder())
                        .build();
                    
                    if (o.getItems() != null) {
                        java.util.List<OptionItemEntity> itemEntities = o.getItems().stream()
                            .map(i -> OptionItemEntity.builder()
                                .id(i.getId())
                                .optionId(o.getId())
                                .name(i.getName())
                                .priceDelta(i.getPriceDelta())
                                .sortOrder(i.getSortOrder())
                                .build())
                            .collect(java.util.stream.Collectors.toList());
                        optionEntity.getItems().addAll(itemEntities);
                    }
                    return optionEntity;
                })
                .collect(java.util.stream.Collectors.toList());
            entity.options.addAll(optionEntities);
        }
        return entity;
    }
}
