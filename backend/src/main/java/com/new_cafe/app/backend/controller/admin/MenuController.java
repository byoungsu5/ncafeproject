package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.dto.MenuDetailResponse;
import com.new_cafe.app.backend.dto.MenuImageListResponse;
import com.new_cafe.app.backend.dto.MenuListRequest;
import com.new_cafe.app.backend.dto.MenuListResponse;
import com.new_cafe.app.backend.dto.MenuUpdateResponse;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.service.MenuService;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class MenuController {

    private MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    // 목록 조회 데이터 반환
    @GetMapping("/admin/menus")
    public MenuListResponse menu(MenuListRequest request) {
        MenuListResponse response = menuService.getMenus(request);
        return response;
    }

    // 상세 조회 데이터 반환
    @GetMapping("/admin/menus/{id}")
    public MenuDetailResponse getMenu(@PathVariable("id") Long id) {
        return menuService.getMenu(id);
    }

    // 메뉴 생성 데이터 입력
    @PostMapping("/admin/menus")
    public String newMenu(Menu menu) {
        // TODO: implement properly
        return "{\"message\": \"newMenu\"}";
    }

    @PutMapping("/admin/menus/{id}")
    public MenuUpdateResponse updateMenu(@PathVariable("id") Long id, Menu menu) {
        // TODO: implement properly
        return MenuUpdateResponse.builder().id(id).build();
    }

    // 메뉴 삭제 데이터 입력
    @DeleteMapping("/admin/menus/{id}")
    public String deleteMenu(@PathVariable("id") Long id) {
        menuService.deleteMenu(id);
        return "{\"message\": \"deleteMenu\"}";
    }

    @GetMapping("/admin/menus/{id}/menu-images")
    public MenuImageListResponse getMenuImages(@PathVariable("id") Long id) {
        MenuImageListResponse response = menuService.getMenuImages(id);
        return response;
    }
}
