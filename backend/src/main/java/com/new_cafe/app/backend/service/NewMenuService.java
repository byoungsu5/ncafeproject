package com.new_cafe.app.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.new_cafe.app.backend.dto.MenuCreateRequest;
import com.new_cafe.app.backend.dto.MenuCreateResponse;
import com.new_cafe.app.backend.dto.MenuDetailResponse;
import com.new_cafe.app.backend.dto.MenuListRequest;
import com.new_cafe.app.backend.dto.MenuListResponse;
import com.new_cafe.app.backend.dto.MenuUpdateRequest;
import com.new_cafe.app.backend.dto.MenuUpdateResponse;
import com.new_cafe.app.backend.dto.MenuResponse;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.repository.CategoryRepository;
import com.new_cafe.app.backend.repository.MenuRepository;
import com.new_cafe.app.backend.repository.MenuImageRepository;
import com.new_cafe.app.backend.entity.MenuImage;

@Service
public class NewMenuService implements MenuService {

    private CategoryRepository categoryRepository;
    private MenuRepository menuRepository;
    private MenuImageRepository menuImageRepository; // menuImageRepository.findAllByMenuId(menu.getId());

    public NewMenuService(MenuRepository menuRepository, CategoryRepository categoryRepository,
            MenuImageRepository menuImageRepository) {
        this.menuRepository = menuRepository;
        this.categoryRepository = categoryRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public MenuCreateResponse createMenu(MenuCreateRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createMenu'");
    }

    @Override
    public MenuListResponse getMenus(MenuListRequest request) {

        Integer categoryId = request.getCategoryId();
        String searchQuery = request.getSearchQuery();

        // Menu <----> MenuResponse ----> [] ----> MenuListResponse
        List<Menu> menus = menuRepository.findAllByCategoryAndSearchQuery(categoryId, searchQuery);

        List<MenuResponse> menuResponses = menus
                .stream()
                .map(menu -> {

                    String categoryName = categoryRepository.findById(menu.getCategoryId()).getName();

                    List<MenuImage> images = menuImageRepository.findAllByMenuId(menu.getId());
                    // Primary image or first image or default

                    // images의 개수가 0인 경우는 blank.png 이미지를 사용하도록 하고
                    String imageSrc = "blank.png";
                    // images의 개수가 1인 경우는 srcUrl을 사용하고
                    if (images.size() > 0) {
                        imageSrc = images.get(0).getSrcUrl();
                    }

                    return MenuResponse
                            .builder()
                            .id(menu.getId())
                            .korName(menu.getKorName())
                            .engName(menu.getEngName())
                            .description(menu.getDescription())
                            .price(menu.getPrice())
                            .categoryName(categoryName) // menu.getCategoryId(); ->
                                                        // categoryRepository.findById(menu.getCategoryId()).getName()
                            .imageSrc(imageSrc) // Real image src
                            .isAvailable(menu.getIsAvailable())
                            .isSoldOut(false)
                            .sortOrder(1)
                            .createdAt(menu.getCreatedAt())
                            .updatedAt(menu.getUpdatedAt())
                            .build();
                })
                .toList();

        return MenuListResponse
                .builder()
                .menus(menuResponses)
                .total(100)
                .build();
    }

    @Override
    public MenuDetailResponse getMenu(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getMenu'");
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateMenu'");
    }

    @Override
    public void deleteMenu(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteMenu'");
    }

}
