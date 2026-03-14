package com.new_cafe.app.backend.menu.application.dto;

import java.util.List;

import com.new_cafe.app.backend.menu.domain.Menu;

public record MenuResponse(
        Long id,
        String korName,
        String engName,
        String slug,
        String description,
        Integer price,
        String categoryName,
        String imageSrc,
        Boolean isAvailable,
        Boolean isSoldOut,
        Integer sortOrder,
        java.time.LocalDateTime createdAt,
        java.time.LocalDateTime updatedAt,
        List<Menu.MenuOptionInfo> options
) {
    public static MenuResponse from(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getKorName(),
                menu.getEngName(),
                menu.getSlug(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategoryName(),
                menu.getImageSrc(),
                menu.getIsAvailable(),
                menu.getIsSoldOut(),
                menu.getSortOrder(),
                menu.getCreatedAt(),
                menu.getUpdatedAt(),
                menu.getOptions()
        );
    }
}

