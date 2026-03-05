package com.new_cafe.app.backend.admin.menu.adapter.in.web.dto;

import java.util.List;

import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;

public record MenuListResponse(
        List<MenuResponse> menus,
        int total
) {
    public static MenuListResponse from(MenuListResult result) {
        List<MenuResponse> responses = result.menus().stream()
                .map(MenuResponse::from)
                .toList();
        return new MenuListResponse(responses, result.total());
    }
}
