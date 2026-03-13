package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import java.time.LocalDateTime;

import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;

public record MenuResponse(
        Long id,
        String korName,
        String engName,
        String slug,
        String description,
        Integer price,
        Long categoryId,
        Boolean isAvailable,
        String imageSrc,
        String categoryName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        java.util.List<com.new_cafe.app.backend.admin.menu.domain.MenuOption> options
) {
    public static MenuResponse from(MenuResult result) {
        return new MenuResponse(
                result.id(),
                result.korName(),
                result.engName(),
                result.slug(),
                result.description(),
                result.price(),
                result.categoryId(),
                result.isAvailable(),
                result.imageSrc(),
                result.categoryName(),
                result.createdAt(),
                result.updatedAt(),
                result.options()
        );
    }
}
