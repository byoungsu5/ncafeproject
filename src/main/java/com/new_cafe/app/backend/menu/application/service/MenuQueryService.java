package com.new_cafe.app.backend.menu.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.new_cafe.app.backend.menu.application.dto.MenuListResponse;
import com.new_cafe.app.backend.menu.application.dto.MenuResponse;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.Menu;

@Service
@Transactional(readOnly = true)
public class MenuQueryService implements GetMenuUseCase {

    private final LoadMenuPort loadMenuPort;

    public MenuQueryService(LoadMenuPort loadMenuPort) {
        this.loadMenuPort = loadMenuPort;
    }

    @Override
    public MenuResponse getMenu(Long id) {
        Menu menu = loadMenuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + id));
        return MenuResponse.from(menu);
    }

    @Override
    public MenuListResponse getMenus(Long categoryId, String query) {
        var menus = loadMenuPort.findAll(categoryId, query);
        return MenuListResponse.from(menus);
    }
}
