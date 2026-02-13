package com.new_cafe.app.menu.application.port.in;

import com.new_cafe.app.menu.domain.model.Menu;
import java.util.List;

public interface MenuUseCase {
    List<Menu> getMenuList(Integer categoryId, String searchQuery);
    Menu getMenuDetail(Long id);
}
