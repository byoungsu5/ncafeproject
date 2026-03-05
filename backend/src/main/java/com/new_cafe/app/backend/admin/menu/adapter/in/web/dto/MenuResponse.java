package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import java.time.LocalDateTime;

import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;

public record MenuResponse(
        Long id,
        String korName,
        String engName,
        String description,
        Integer price,
        Long categoryId,
        Boolean isAvailable,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MenuResponse from(MenuResult result) {
        return new MenuResponse(
                result.id(),
                result.korName(),
                result.engName(),
                result.description(),
                result.price(),
                result.categoryId(),
                result.isAvailable(),
                result.createdAt(),
                result.updatedAt()
        );
    }
}
