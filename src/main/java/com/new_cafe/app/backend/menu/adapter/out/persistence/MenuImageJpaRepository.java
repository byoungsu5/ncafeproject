package com.new_cafe.app.backend.menu.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MenuImageJpaRepository extends JpaRepository<MenuImageEntity, Long> {

    @Query(value = "SELECT src_url FROM menu_images WHERE menu_id = :menuId ORDER BY sort_order LIMIT 1", nativeQuery = true)
    String findFirstImageSrcByMenuId(@Param("menuId") Long menuId);
}
