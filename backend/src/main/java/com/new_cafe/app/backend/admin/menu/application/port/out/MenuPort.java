package com.new_cafe.app.backend.admin.menu.application.port.out;

import java.util.List;
import java.util.Optional;

import com.new_cafe.app.backend.admin.menu.domain.Menu;

public interface MenuPort {
    Menu save(Menu menu);
    Optional<Menu> findById(Long id);
    List<Menu> findAll(String query, Long categoryId);
    void deleteById(Long id);
}
