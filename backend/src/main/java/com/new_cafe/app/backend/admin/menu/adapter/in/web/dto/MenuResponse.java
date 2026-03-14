package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.domain.MenuOption;

public record MenuResponse(
        Long id,
        String korName,
        String korNameDebug,
        String engName,
        String slug,
        String description,
        Integer price,
        Long categoryId,
        Boolean isAvailable,
        Boolean isSoldOut,
        String imageSrc,
        String categoryName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<MenuOption> options) {
    public static MenuResponse from(MenuResult result) {
        return new MenuResponse(
                result.id(),
                result.korName(),
                "DEBUG_VERSION_1",
                result.engName(),
                result.slug(),
                result.description(),
                result.price(),
                result.categoryId(),
                result.isAvailable(),
                result.isSoldOut(),
                result.imageSrc(),
                result.categoryName(),
                result.createdAt(),
                result.updatedAt(),
                result.options());
    }
}
