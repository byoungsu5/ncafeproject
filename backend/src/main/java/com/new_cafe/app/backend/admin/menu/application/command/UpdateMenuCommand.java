package com.new_cafe.app.backend.admin.menu.application.command;

public record UpdateMenuCommand(
        Long id,
        String korName,
        String engName,
        String description,
        Integer price,
        Long categoryId,
        Boolean isAvailable
) {}
