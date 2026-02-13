package com.new_cafe.app.menu.application.port.out;

import com.new_cafe.app.menu.domain.model.Menu;
import java.util.List;

public interface MenuRepository {
    List<Menu> findAll(Integer categoryId, String searchQuery);
    Menu findById(Long id);
    void save(Menu menu);
    void delete(Long id);
}
