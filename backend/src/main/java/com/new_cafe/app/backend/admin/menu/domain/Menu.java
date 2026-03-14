package com.new_cafe.app.backend.admin.menu.domain;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private Long id;
    private String korName;
    private String engName;
    private String slug;
    private String description;
    private Integer price;
    private Long categoryId;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private Integer sortOrder;
    private String imageSrc;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private java.util.List<MenuOption> options;

    public static Menu create(String korName, String engName, String slug, String description,
                               Integer price, Long categoryId, Boolean isAvailable) {
        String finalSlug = (slug == null || slug.isBlank()) ? generateSlug(engName) : slug;
        return Menu.builder()
                .korName(korName)
                .engName(engName)
                .slug(finalSlug)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .isAvailable(isAvailable != null ? isAvailable : true)
                .isSoldOut(false)
                .build();
    }

    public void update(String korName, String engName, String slug, String description,
                       Integer price, Long categoryId, Boolean isAvailable, Boolean isSoldOut) {
        this.korName = korName;
        this.engName = engName;
        this.slug = (slug == null || slug.isBlank()) ? generateSlug(engName) : slug;
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.isAvailable = isAvailable;
        this.isSoldOut = isSoldOut;
    }

    private static String generateSlug(String engName) {
        if (engName == null || engName.isBlank()) return "menu-" + System.currentTimeMillis();
        return engName.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "") // 특수문자 제거
                .replaceAll("\\s+", "-");        // 공백을 하이픈으로 변경
    }
}
