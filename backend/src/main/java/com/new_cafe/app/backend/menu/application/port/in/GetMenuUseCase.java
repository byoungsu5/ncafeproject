package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.application.dto.MenuListResponse;
import com.new_cafe.app.backend.menu.application.dto.MenuResponse;

public interface GetMenuUseCase {
    MenuResponse getMenu(Long id);
    MenuListResponse getMenus(Long categoryId, String query);
}
