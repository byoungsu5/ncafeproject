package com.new_cafe.app.backend.admin.menu.adapter.in.web;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<MenuResponse> createMenu(@Valid @RequestBody CreateMenuCommand command) {
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
    public ResponseEntity<MenuResponse> getMenu(@PathVariable java.lang.Long id) {
        System.out.println("[AdminMenuController] GET /api/admin/menus/" + id);
        MenuResult result = getMenuUseCase.getMenu(id);
        System.out.println("[AdminMenuController] Found result: " + (result != null ? result.korName() : "null"));
        return ResponseEntity.ok(MenuResponse.from(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable java.lang.Long id,
            @Valid @RequestBody UpdateMenuCommand command) {
        UpdateMenuCommand commandWithId = new UpdateMenuCommand(
                id,
                command.korName(),
                command.engName(),
                command.slug(),
                command.description(),
                command.price(),
                command.categoryId(),
                command.isAvailable(),
                command.isSoldOut(),
                command.images(),
                command.options()
        );
        MenuResult result = updateMenuUseCase.updateMenu(commandWithId);
        return ResponseEntity.ok(MenuResponse.from(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable java.lang.Long id) {
        deleteMenuUseCase.deleteMenu(id);
        return ResponseEntity.noContent().build();
    }
}
