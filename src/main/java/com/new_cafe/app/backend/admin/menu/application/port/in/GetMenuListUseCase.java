package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;

public interface GetMenuListUseCase {
    MenuListResult getMenus(String query, Long categoryId);
}
