package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.MenuListResponse;
import com.new_cafe.app.backend.admin.menu.adapter.in.web.dto.MenuResponse;
import com.new_cafe.app.backend.admin.menu.application.command.CreateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;

@RestController("adminMenuController")
@RequestMapping("/api/admin/menus")
public class MenuController {

    private final CreateMenuUseCase createMenuUseCase;
    private final UpdateMenuUseCase updateMenuUseCase;
    private final DeleteMenuUseCase deleteMenuUseCase;
    private final GetMenuUseCase getMenuUseCase;
    private final GetMenuListUseCase getMenuListUseCase;

    public MenuController(
            CreateMenuUseCase createMenuUseCase,
            UpdateMenuUseCase updateMenuUseCase,
            DeleteMenuUseCase deleteMenuUseCase,
            GetMenuUseCase getMenuUseCase,
            GetMenuListUseCase getMenuListUseCase) {
        this.createMenuUseCase = createMenuUseCase;
        this.updateMenuUseCase = updateMenuUseCase;
        this.deleteMenuUseCase = deleteMenuUseCase;
        this.getMenuUseCase = getMenuUseCase;
        this.getMenuListUseCase = getMenuListUseCase;
    }

    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(@RequestBody CreateMenuCommand command) {
        MenuResult result = createMenuUseCase.createMenu(command);
        return ResponseEntity.status(HttpStatus.CREATED).body(MenuResponse.from(result));
    }

    @GetMapping
    public ResponseEntity<MenuListResponse> getMenus(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId) {
        MenuListResult result = getMenuListUseCase.getMenus(query, categoryId);
        return ResponseEntity.ok(MenuListResponse.from(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuResponse> getMenu(@PathVariable Long id) {
        MenuResult result = getMenuUseCase.getMenu(id);
        return ResponseEntity.ok(MenuResponse.from(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable Long id,
            @RequestBody UpdateMenuCommand command) {
        UpdateMenuCommand commandWithId = new UpdateMenuCommand(
                id,
                command.korName(),
                command.engName(),
                command.description(),
                command.price(),
                command.categoryId(),
                command.isAvailable()
        );
        MenuResult result = updateMenuUseCase.updateMenu(commandWithId);
        return ResponseEntity.ok(MenuResponse.from(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        deleteMenuUseCase.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }
}
