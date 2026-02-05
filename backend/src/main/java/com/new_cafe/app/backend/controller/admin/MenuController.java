package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.dto.MenuListRequest;
import com.new_cafe.app.backend.entity.Menu;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.new_cafe.app.backend.service.MenuService;

import com.new_cafe.app.backend.dto.MenuListRequest;
import com.new_cafe.app.backend.dto.MenuListResponse;

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
    public String editMenu() {
        return "editMenu";
    }

    // 메뉴 생성 데이터 입력
    @PostMapping("/admin/menus")
    public String newMenu(Menu menu) {
        return "newMenu";
    }

    @PutMapping("path/{id}")
    public String editMenu(Menu menu) {
        // TODO: process PUT request

        return "editMenu";
    }

    // 메뉴 삭제 데이터 입력
    @DeleteMapping("/admin/menus/{id}")
    public String deleteMenu() {
        return "deleteMenu";
    }
}
