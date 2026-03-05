package com.new_cafe.app.backend.menu.adapter.in.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.menu.application.dto.MenuListResponse;
import com.new_cafe.app.backend.menu.application.dto.MenuResponse;
import com.new_cafe.app.backend.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.service.CategoryService;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final GetMenuUseCase getMenuUseCase;
    private final CategoryService categoryService;

    public MenuController(GetMenuUseCase getMenuUseCase, CategoryService categoryService) {
        this.getMenuUseCase = getMenuUseCase;
        this.categoryService = categoryService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @GetMapping("/menus")
    public ResponseEntity<MenuListResponse> getMenus(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String query) {
        MenuListResponse response = getMenuUseCase.getMenus(categoryId, query);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/menus/{id}")
    public ResponseEntity<MenuResponse> getMenu(@PathVariable Long id) {
        MenuResponse response = getMenuUseCase.getMenu(id);
        return ResponseEntity.ok(response);
    }
}
