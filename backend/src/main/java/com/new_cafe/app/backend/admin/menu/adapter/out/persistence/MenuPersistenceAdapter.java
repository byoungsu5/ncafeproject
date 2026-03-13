package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.domain.Menu;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuEntity;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuJpaRepository;

import com.new_cafe.app.backend.menu.adapter.out.persistence.MenuImageJpaRepository;

@Component("adminMenuPersistenceAdapter")
public class MenuPersistenceAdapter implements MenuPort {

    private final MenuJpaRepository repository;
    private final MenuImageJpaRepository menuImageRepository;

    public MenuPersistenceAdapter(MenuJpaRepository repository,
                                  MenuImageJpaRepository menuImageRepository) {
        this.repository = repository;
        this.menuImageRepository = menuImageRepository;
    }

    @Override
    public Menu save(Menu menu) {
        MenuEntity entity;
        if (menu.getId() != null) {
            entity = repository.findById(menu.getId())
                    .orElseGet(() -> MenuEntity.fromDomain(menu));
            System.out.println("[MenuPersistenceAdapter] Updating menu " + menu.getId() + " with " + (menu.getOptions() != null ? menu.getOptions().size() : 0) + " options");
            entity.update(menu);
        } else {
            System.out.println("[MenuPersistenceAdapter] Creating new menu with " + (menu.getOptions() != null ? menu.getOptions().size() : 0) + " options");
            entity = MenuEntity.fromDomain(menu);
        }
        
        MenuEntity saved = repository.saveAndFlush(entity);
        return findById(saved.getId()).orElseThrow();
    }

    @Override
    public Optional<Menu> findById(Long id) {
        return repository.findById(id)
                .map(entity -> {
                    String imageSrc = menuImageRepository.findFirstImageSrcByMenuId(id);
                    return entity.toDomain(imageSrc);
                });
    }

    @Override
    public List<Menu> findAll(String query, Long categoryId) {
        List<MenuEntity> entities;
        if (categoryId != null && query != null && !query.isEmpty()) {
            entities = repository.findByCategoryIdAndQuery(categoryId, query);
        } else if (categoryId != null) {
            entities = repository.findByCategoryId(categoryId);
        } else if (query != null && !query.isEmpty()) {
            entities = repository.findByQuery(query);
        } else {
            entities = repository.findAll();
        }

        return entities.stream()
                .map(entity -> {
                    String imageSrc = menuImageRepository.findFirstImageSrcByMenuId(entity.getId());
                    return entity.toDomain(imageSrc);
                })
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
