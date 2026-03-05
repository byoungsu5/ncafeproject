package com.new_cafe.app.backend.admin.menu.application.result;

import java.time.LocalDateTime;

import com.new_cafe.app.backend.admin.menu.domain.Menu;

public record MenuResult(
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
    public static MenuResult from(Menu menu) {
        return new MenuResult(
                menu.getId(),
                menu.getKorName(),
                menu.getEngName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategoryId(),
                menu.getIsAvailable(),
                menu.getCreatedAt(),
                menu.getUpdatedAt()
        );
    }
}
