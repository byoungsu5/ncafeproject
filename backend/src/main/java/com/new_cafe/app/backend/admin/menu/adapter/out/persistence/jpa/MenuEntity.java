package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import com.new_cafe.app.backend.admin.menu.domain.Menu;
import com.new_cafe.app.backend.admin.menu.domain.MenuOption;
import com.new_cafe.app.backend.admin.menu.domain.OptionItem;
import com.new_cafe.app.backend.menu.adapter.out.persistence.CategoryEntity;

@Entity(name = "AdminMenu")
@Table(name = "menus")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private java.lang.Long id;

    @Column(name = "kor_name")
    private java.lang.String korName;

    @Column(name = "eng_name")
    private java.lang.String engName;

    private java.lang.String slug;

    private java.lang.String description;

    private java.lang.Integer price;

    @Column(name = "category_id")
    private java.lang.Long categoryId;

    @Column(name = "is_available")
    private java.lang.Boolean isAvailable;

    @Column(name = "is_sold_out")
    private java.lang.Boolean isSoldOut;

    @Column(name = "sort_order")
    private java.lang.Integer sortOrder;

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
    private List<MenuOptionEntity> options = new ArrayList<>();

    public Menu toDomain(String imageSrc, List<String> images) {
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
                .isSoldOut(isSoldOut != null ? isSoldOut : false)
                .sortOrder(sortOrder)
                .imageSrc(imageSrc != null ? imageSrc : "blank.png")
                .images(images != null ? images : new ArrayList<>())
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
                                        .collect(Collectors.toList()) : new ArrayList<>())
                                .build())
                        .collect(Collectors.toList()) : new ArrayList<>())
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
        this.isSoldOut = menu.getIsSoldOut();
        this.sortOrder = menu.getSortOrder();
        
        syncOptions(menu.getOptions());
    }

    private void syncOptions(List<MenuOption> domainOptions) {
        if (domainOptions == null || domainOptions.isEmpty()) {
            this.options.clear();
            return;
        }

        Map<Long, MenuOptionEntity> existingMap = this.options.stream()
                .filter(o -> o.getId() != null)
                .collect(Collectors.toMap(MenuOptionEntity::getId, o -> o));

        List<MenuOptionEntity> newOptions = new ArrayList<>();

        for (var domainOpt : domainOptions) {
            MenuOptionEntity existingOpt = (domainOpt.getId() != null) ? existingMap.get(domainOpt.getId()) : null;

            if (existingOpt != null) {
                existingOpt.update(domainOpt.getName(), domainOpt.getType(), domainOpt.getIsRequired(), domainOpt.getSortOrder());
                syncItems(existingOpt, domainOpt.getItems());
                newOptions.add(existingOpt);
                existingMap.remove(domainOpt.getId());
            } else {
                MenuOptionEntity newOpt = MenuOptionEntity.builder()
                        .menuId(this.id)
                        .name(domainOpt.getName())
                        .type(domainOpt.getType())
                        .isRequired(domainOpt.getIsRequired())
                        .sortOrder(domainOpt.getSortOrder())
                        .build();
                syncItems(newOpt, domainOpt.getItems());
                newOptions.add(newOpt);
            }
        }

        this.options.clear();
        this.options.addAll(newOptions);
    }

    private void syncItems(MenuOptionEntity optionEntity, List<com.new_cafe.app.backend.admin.menu.domain.OptionItem> domainItems) {
        if (domainItems == null || domainItems.isEmpty()) {
            optionEntity.getItems().clear();
            return;
        }

        Map<Long, OptionItemEntity> existingMap = optionEntity.getItems().stream()
                .filter(i -> i.getId() != null)
                .collect(Collectors.toMap(OptionItemEntity::getId, i -> i));

        List<OptionItemEntity> newItems = new ArrayList<>();

        for (var domainItem : domainItems) {
            OptionItemEntity existingItem = (domainItem.getId() != null) ? existingMap.get(domainItem.getId()) : null;

            if (existingItem != null) {
                existingItem.update(domainItem.getName(), domainItem.getPriceDelta(), domainItem.getSortOrder());
                newItems.add(existingItem);
                existingMap.remove(domainItem.getId());
            } else {
                OptionItemEntity newItem = OptionItemEntity.builder()
                        .name(domainItem.getName())
                        .priceDelta(domainItem.getPriceDelta())
                        .sortOrder(domainItem.getSortOrder())
                        .build();
                newItems.add(newItem);
            }
        }

        optionEntity.getItems().clear();
        optionEntity.getItems().addAll(newItems);
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
                .isSoldOut(menu.getIsSoldOut())
                .sortOrder(menu.getSortOrder())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .build();
        
        if (menu.getOptions() != null) {
            List<MenuOptionEntity> optionEntities = menu.getOptions().stream()
                .map(o -> {
                    MenuOptionEntity optionEntity = MenuOptionEntity.builder()
                        .id(menu.getId() != null ? o.getId() : null)
                        .menuId(menu.getId())
                        .name(o.getName())
                        .type(o.getType())
                        .isRequired(o.getIsRequired())
                        .sortOrder(o.getSortOrder())
                        .build();
                    
                    if (o.getItems() != null) {
                        List<OptionItemEntity> itemEntities = o.getItems().stream()
                            .map(i -> OptionItemEntity.builder()
                                .id(menu.getId() != null ? i.getId() : null)
                                .name(i.getName())
                                .priceDelta(i.getPriceDelta())
                                .sortOrder(i.getSortOrder())
                                .build())
                            .collect(Collectors.toList());
                        optionEntity.getItems().addAll(itemEntities);
                    }
                    return optionEntity;
                })
                .collect(Collectors.toList());
            entity.options.addAll(optionEntities);
        }
        return entity;
    }
}
