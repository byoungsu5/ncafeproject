package com.new_cafe.app.backend.menu.application.dto;

import java.util.List;

import com.new_cafe.app.backend.menu.domain.Menu;

public record MenuListResponse(
        List<MenuResponse> menus,
        int total
) {
    public static MenuListResponse from(List<Menu> menuList) {
        List<MenuResponse> responses = menuList.stream()
                .map(MenuResponse::from)
                .toList();
        return new MenuListResponse(responses, responses.size());
    }
}
