package com.new_cafe.app.backend.admin.menu.application.result;

import java.time.LocalDateTime;
import java.util.List;
import com.new_cafe.app.backend.admin.menu.domain.Menu;
import com.new_cafe.app.backend.admin.menu.domain.MenuOption;

public record MenuResult(
        Long id,
        String korName,
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
        List<MenuOption> options
) {
    public static MenuResult from(Menu menu) {
        return new MenuResult(
                menu.getId(),
                menu.getKorName(),
                menu.getEngName(),
                menu.getSlug(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategoryId(),
                menu.getIsAvailable(),
                menu.getIsSoldOut(),
                menu.getImageSrc(),
                menu.getCategoryName(),
                menu.getCreatedAt(),
                menu.getUpdatedAt(),
                menu.getOptions()
        );
    }
}
