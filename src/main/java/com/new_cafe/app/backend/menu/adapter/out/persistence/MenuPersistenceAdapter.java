package com.new_cafe.app.backend.menu.adapter.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.new_cafe.app.backend.menu.application.port.out.LoadMenuPort;
import com.new_cafe.app.backend.menu.domain.Menu;

@Component
public class MenuPersistenceAdapter implements LoadMenuPort {

    private final MenuJpaRepository menuRepository;
    private final MenuImageJpaRepository menuImageRepository;

    public MenuPersistenceAdapter(MenuJpaRepository menuRepository,
                                  MenuImageJpaRepository menuImageRepository) {
        this.menuRepository = menuRepository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public Optional<Menu> findById(Long id) {
        return menuRepository.findByIdAndIsAvailableTrue(id)
                .map(entity -> {
                    String imageSrc = menuImageRepository.findFirstImageSrcByMenuId(id);
                    return entity.toDomain(imageSrc);
                });
    }

    @Override
    public List<Menu> findAll(Long categoryId, String query) {
        List<MenuEntity> entities;

        if (categoryId != null && query != null && !query.isEmpty()) {
            entities = menuRepository.findAllAvailableByCategoryIdAndQuery(categoryId, query);
        } else if (categoryId != null) {
            entities = menuRepository.findByIsAvailableTrueAndCategoryId(categoryId);
        } else if (query != null && !query.isEmpty()) {
            entities = menuRepository.findAllAvailableByQuery(query);
        } else {
            entities = menuRepository.findByIsAvailableTrue();
        }

        return entities.stream()
                .map(entity -> {
                    String imageSrc = menuImageRepository.findFirstImageSrcByMenuId(entity.getId());
                    return entity.toDomain(imageSrc);
                })
                .toList();
    }
}
