package com.new_cafe.app.backend.menu.application.port.in;

import com.new_cafe.app.backend.menu.application.dto.MenuListResponse;
import com.new_cafe.app.backend.menu.application.dto.MenuResponse;
import com.new_cafe.app.backend.menu.domain.MenuImage;

import java.util.List;

public interface GetMenuUseCase {
    MenuResponse getMenu(Long id);
    MenuResponse getMenuBySlug(String slug);
    MenuListResponse getMenus(Long categoryId, String query);
    List<MenuImage> getMenuImages(Long menuId);
}
