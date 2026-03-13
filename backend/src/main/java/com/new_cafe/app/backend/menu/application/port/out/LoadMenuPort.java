package com.new_cafe.app.backend.menu.application.port.out;

import java.util.List;
import java.util.Optional;

import com.new_cafe.app.backend.menu.domain.Menu;
import com.new_cafe.app.backend.menu.domain.MenuImage;

public interface LoadMenuPort {
    Optional<Menu> findById(Long id);
    Optional<Menu> findBySlug(String slug);
    List<Menu> findAll(Long categoryId, String query);
    List<MenuImage> findImagesByMenuId(Long menuId);
}
