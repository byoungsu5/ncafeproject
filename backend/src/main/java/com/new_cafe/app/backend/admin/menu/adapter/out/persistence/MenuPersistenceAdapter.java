package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Component;
import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.domain.Menu;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuEntity;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuJpaRepository;
import com.new_cafe.app.backend.menu.adapter.out.persistence.MenuImageJpaRepository;
import com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuImageEntity;

@Component("adminMenuPersistenceAdapter")
public class MenuPersistenceAdapter implements MenuPort {

    private final MenuJpaRepository repository;
    private final MenuImageJpaRepository userMenuImageRepository;
    private final com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuImageJpaRepository adminMenuImageRepository;

    public MenuPersistenceAdapter(MenuJpaRepository repository,
                                   MenuImageJpaRepository userMenuImageRepository,
                                   com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa.MenuImageJpaRepository adminMenuImageRepository) {
        this.repository = repository;
        this.userMenuImageRepository = userMenuImageRepository;
        this.adminMenuImageRepository = adminMenuImageRepository;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public Menu save(Menu menu) {
        MenuEntity entity;
        if (menu.getId() != null) {
            entity = repository.findById(menu.getId())
                    .orElseGet(() -> MenuEntity.fromDomain(menu));
            entity.update(menu);
        } else {
            entity = MenuEntity.fromDomain(menu);
        }
        
        MenuEntity saved = repository.saveAndFlush(entity);
        
        // Handle images
        if (menu.getImages() != null) {
            // Simplest approach: Delete existing and re-insert for updates
            adminMenuImageRepository.deleteByMenuId(saved.getId());
            for (int i = 0; i < menu.getImages().size(); i++) {
                MenuImageEntity imageEntity = MenuImageEntity.builder()
                        .menuId(saved.getId())
                        .srcUrl(menu.getImages().get(i))
                        .sortOrder(i)
                        .isPrimary(i == 0)
                        .build();
                adminMenuImageRepository.save(imageEntity);
            }
        }
        
        return findById(saved.getId()).orElseThrow();
    }

    @Override
    public Optional<Menu> findById(Long id) {
        return repository.findById(id)
                .map(entity -> {
                    String imageSrc = userMenuImageRepository.findFirstImageSrcByMenuId(id);
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
                    String imageSrc = userMenuImageRepository.findFirstImageSrcByMenuId(entity.getId());
                    return entity.toDomain(imageSrc);
                })
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
