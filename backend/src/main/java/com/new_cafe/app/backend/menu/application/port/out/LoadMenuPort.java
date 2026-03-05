package com.new_cafe.app.backend.menu.application.port.out;

import java.util.List;
import java.util.Optional;

import com.new_cafe.app.backend.menu.domain.Menu;

public interface LoadMenuPort {
    Optional<Menu> findById(Long id);
    List<Menu> findAll(Long categoryId, String query);
}
