package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AdminMenuImageJpaRepository extends JpaRepository<MenuImageEntity, Long> {
    List<MenuImageEntity> findByMenuId(Long menuId);

    void deleteByMenuId(Long menuId);
}
