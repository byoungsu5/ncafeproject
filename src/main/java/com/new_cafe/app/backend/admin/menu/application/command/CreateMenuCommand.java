package com.new_cafe.app.backend.admin.menu.application.command;

public record CreateMenuCommand(
        String korName,
        String engName,
        String description,
        Integer price,
        Long categoryId
) {}
