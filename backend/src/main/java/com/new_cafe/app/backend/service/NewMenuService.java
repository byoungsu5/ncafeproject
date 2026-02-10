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
import com.new_cafe.app.backend.dto.MenuImageListResponse;
import com.new_cafe.app.backend.dto.MenuImageResponse;
import com.new_cafe.app.backend.dto.MenuResponse;
import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.entity.Menu;
import com.new_cafe.app.backend.entity.MenuImage;
import com.new_cafe.app.backend.repository.CategoryRepository;
import com.new_cafe.app.backend.repository.MenuImageRepository;
import com.new_cafe.app.backend.repository.MenuRepository;

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
    public MenuImageListResponse getMenuImages(Long id) {
        Menu menu = menuRepository.findById(id);
        String menuName = (menu != null) ? menu.getKorName() : "";
        List<MenuImage> images = menuImageRepository.findAllByMenuId(id);

        List<MenuImageResponse> imageResponses = images.stream()
                .map(img -> MenuImageResponse.builder()
                        .id(img.getId())
                        .url(img.getSrcUrl())
                        .sortOrder(img.getSortOrder())
                        .isPrimary(img.getSortOrder() != null && img.getSortOrder() == 1)
                        .altText(menuName)
                        .build())
                .toList();

        return MenuImageListResponse.builder()
                .images(imageResponses)
                .build();
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

                    Category category = categoryRepository.findById(menu.getCategoryId());
                    String categoryName = (category != null) ? category.getName() : "Unknown";

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
        Menu menu = menuRepository.findById(id);
        if (menu == null) {
            throw new RuntimeException("Menu not found with id: " + id);
        }

        String categoryName = "Unknown";
        if (menu.getCategoryId() != null) {
            Category category = categoryRepository.findById(menu.getCategoryId());
            if (category != null) {
                categoryName = category.getName();
            }
        }

        return MenuDetailResponse.builder()
                .id(menu.getId())
                .korName(menu.getKorName())
                .engName(menu.getEngName())
                .categoryName(categoryName)
                .price(menu.getPrice())
                .isAvailable(menu.getIsAvailable())
                .createdAt(menu.getCreatedAt())
                .description(menu.getDescription())
                .build();
    }

    @Override
    public MenuUpdateResponse updateMenu(MenuUpdateRequest request) {
        // Implementation for updateMenu
        return MenuUpdateResponse.builder().build(); // Placeholder
    }

    @Override
    public void deleteMenu(Long id) {
        // Implementation for deleteMenu
    }

}
