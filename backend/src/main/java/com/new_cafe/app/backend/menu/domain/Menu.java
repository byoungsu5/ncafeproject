package com.new_cafe.app.backend.menu.domain;

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
    private String categoryName;
    private Boolean isAvailable;
    private Boolean isSoldOut;
    private String imageSrc;
    private Integer sortOrder;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;
    private List<MenuOptionInfo> options;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MenuOptionInfo {
        private Long id;
        private String name;
        private String type;
        private Boolean required;
        private Integer sortOrder;
        private List<OptionItemInfo> items;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OptionItemInfo {
        private Long id;
        private String name;
        private Integer priceDelta;
        private Integer sortOrder;
    }
}
