package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.new_cafe.app.backend.admin.menu.application.port.out.MenuPort;
import com.new_cafe.app.backend.admin.menu.domain.Menu;

@Component("adminMenuPersistenceAdapter")
public class MenuPersistenceAdapter implements MenuPort {

    private final MenuJpaRepository repository;

    public MenuPersistenceAdapter(MenuJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Menu save(Menu menu) {
        MenuEntity entity = MenuEntity.fromDomain(menu);
        MenuEntity saved = repository.save(entity);
        return saved.toDomain();
    }

    @Override
    public Optional<Menu> findById(Long id) {
        return repository.findById(id)
                .map(MenuEntity::toDomain);
    }

    @Override
    public List<Menu> findAll(String query, Long categoryId) {
        if (categoryId != null && query != null && !query.isEmpty()) {
            return repository.findByCategoryIdAndQuery(categoryId, query).stream()
                    .map(MenuEntity::toDomain)
                    .toList();
        }
        if (categoryId != null) {
            return repository.findByCategoryId(categoryId).stream()
                    .map(MenuEntity::toDomain)
                    .toList();
        }
        if (query != null && !query.isEmpty()) {
            return repository.findByQuery(query).stream()
                    .map(MenuEntity::toDomain)
                    .toList();
        }
        return repository.findAll().stream()
                .map(MenuEntity::toDomain)
                .toList();
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
