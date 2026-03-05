package com.new_cafe.app.backend.admin.menu.application.result;

import java.util.List;

import com.new_cafe.app.backend.admin.menu.domain.Menu;

public record MenuListResult(
        List<MenuResult> menus,
        int total
) {
    public static MenuListResult from(List<Menu> menuList) {
        List<MenuResult> results = menuList.stream()
                .map(MenuResult::from)
                .toList();
        return new MenuListResult(results, results.size());
    }
}
