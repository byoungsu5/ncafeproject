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

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(MenuService.class);
    private final MenuPort menuPort;

    public MenuService(MenuPort menuPort) {
        this.menuPort = menuPort;
    }

    @Override
    public MenuResult createMenu(CreateMenuCommand command) {
        log.info("[MenuService] Creating menu: {}", command);
        Menu menu = Menu.create(
                command.korName(),
                command.engName(),
                command.slug(),
                command.description(),
                command.price(),
                command.categoryId(),
                command.isAvailable(),
                command.isSoldOut(),
                command.images() != null ? command.images().stream().map(com.new_cafe.app.backend.admin.menu.application.command.ImageCommand::url).collect(java.util.stream.Collectors.toList()) : java.util.Collections.emptyList()
        );
        
        if (command.options() != null) {
            menu = Menu.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .isAvailable(menu.getIsAvailable())
                .isSoldOut(menu.getIsSoldOut())
                .images(menu.getImages())
                .options(command.options().stream()
                    .map(o -> com.new_cafe.app.backend.admin.menu.domain.MenuOption.builder()
                        .id(o.id())
                        .name(o.name())
                        .type(o.type())
                        .isRequired(o.required())
                        .sortOrder(o.sortOrder())
                        .items(o.items() != null ? o.items().stream()
                            .map(i -> com.new_cafe.app.backend.admin.menu.domain.OptionItem.builder()
                                .id(i.id())
                                .name(i.name())
                                .priceDelta(i.priceDelta())
                                .sortOrder(i.sortOrder())
                                .build())
                            .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                        .build())
                    .collect(java.util.stream.Collectors.toList()))
                .build();
        }
        
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
                command.slug(),
                command.description(),
                command.price(),
                command.categoryId(),
                command.isAvailable(),
                command.isSoldOut(),
                command.images() != null ? command.images().stream().map(com.new_cafe.app.backend.admin.menu.application.command.ImageCommand::url).collect(java.util.stream.Collectors.toList()) : java.util.Collections.emptyList()
        );

        if (command.options() != null) {
            System.out.println("[MenuService] Received " + command.options().size() + " options for menu " + command.id());
            for (int i = 0; i < command.options().size(); i++) {
                System.out.println("  Option " + i + ": name=" + command.options().get(i).name() + ", items=" + (command.options().get(i).items() != null ? command.options().get(i).items().size() : 0));
            }
            java.util.List<com.new_cafe.app.backend.admin.menu.domain.MenuOption> options = command.options().stream()
                .map(o -> com.new_cafe.app.backend.admin.menu.domain.MenuOption.builder()
                    .id(o.id())
                    .name(o.name())
                    .type(o.type())
                    .isRequired(o.required())
                    .sortOrder(o.sortOrder())
                    .items(o.items() != null ? o.items().stream()
                        .map(i -> com.new_cafe.app.backend.admin.menu.domain.OptionItem.builder()
                            .id(i.id())
                            .name(i.name())
                            .priceDelta(i.priceDelta())
                            .sortOrder(i.sortOrder())
                            .build())
                        .collect(java.util.stream.Collectors.toList()) : new java.util.ArrayList<>())
                    .build())
                .collect(java.util.stream.Collectors.toList());
            
            System.out.println("[MenuService] Rebuilding menu with " + options.size() + " options");
            // Note: This is an immutable domain object pattern, ideally we'd have a method on Menu to set options
            menu = Menu.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .slug(menu.getSlug())
                .description(menu.getDescription())
                .price(menu.getPrice())
                .categoryId(menu.getCategoryId())
                .isAvailable(menu.getIsAvailable())
                .isSoldOut(menu.getIsSoldOut())
                .categoryName(menu.getCategoryName())
                .imageSrc(menu.getImageSrc())
                .createdAt(menu.getCreatedAt())
                .updatedAt(menu.getUpdatedAt())
                .images(menu.getImages())
                .options(options)
                .build();
        }

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
