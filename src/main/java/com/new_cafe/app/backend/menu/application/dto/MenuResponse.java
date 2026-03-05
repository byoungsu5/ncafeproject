package com.new_cafe.app.backend.menu.application.dto;

import com.new_cafe.app.backend.menu.domain.Menu;

public record MenuResponse(
        Long id,
        String korName,
        String engName,
        String description,
        Integer price,
        String categoryName,
        String imageSrc,
        Boolean isAvailable
) {
    public static MenuResponse from(Menu menu) {
        return new MenuResponse(
                menu.getId(),
                menu.getKorName(),
                menu.getEngName(),
                menu.getDescription(),
                menu.getPrice(),
                menu.getCategoryName(),
                menu.getImageSrc(),
                menu.getIsAvailable()
        );
    }
}
