package com.new_cafe.app.backend.admin.menu.application.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.new_cafe.app.backend.admin.menu.application.command.CreateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.port.in.CreateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.DeleteMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuListUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.GetMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.in.UpdateMenuUseCase;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.application.result.MenuListResult;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;
import com.new_cafe.app.backend.admin.menu.domain.Menu;

@Service
@Transactional
public class MenuService implements CreateMenuUseCase, UpdateMenuUseCase,
                                     DeleteMenuUseCase, GetMenuUseCase,
                                     GetMenuListUseCase {

    private final MenuPort menuPort;

    public MenuService(MenuPort menuPort) {
        this.menuPort = menuPort;
    }

    @Override
    public MenuResult createMenu(CreateMenuCommand command) {
        Menu menu = Menu.create(
                command.korName(),
                command.engName(),
                command.description(),
                command.price(),
                command.categoryId()
        );
        Menu saved = menuPort.save(menu);
        return MenuResult.from(saved);
    }

    @Override
    public MenuResult updateMenu(UpdateMenuCommand command) {
        Menu menu = menuPort.findById(command.id())
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + command.id()));

        menu.update(
                command.korName(),
                command.engName(),
                command.description(),
                command.price(),
                command.categoryId(),
                command.isAvailable()
        );

        Menu saved = menuPort.save(menu);
        return MenuResult.from(saved);
    }

    @Override
    public void deleteMenu(Long id) {
        menuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + id));
        menuPort.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuResult getMenu(Long id) {
        Menu menu = menuPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Menu not found: " + id));
        return MenuResult.from(menu);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuListResult getMenus(String query, Long categoryId) {
        var menus = menuPort.findAll(query, categoryId);
        return MenuListResult.from(menus);
    }
}
