package com.new_cafe.app.backend.admin.menu.application.command;

public record ImageCommand(
    String url,
    Boolean isPrimary,
    Integer sortOrder
) {}
