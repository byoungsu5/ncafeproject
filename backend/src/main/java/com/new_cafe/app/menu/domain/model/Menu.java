package com.new_cafe.app.menu.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class Menu {
    private final Long id;
    private final String korName;
    private final String engName;
    private final String description;
    private final Integer price;
    private final Long categoryId;
    private final Boolean isAvailable;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;
}
