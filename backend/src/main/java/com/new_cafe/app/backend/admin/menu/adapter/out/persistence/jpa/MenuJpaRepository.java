package com.new_cafe.app.backend.admin.menu.adapter.out.persistence;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository("adminMenuJpaRepository")
public interface MenuJpaRepository extends JpaRepository<MenuEntity, Long> {

    List<MenuEntity> findByCategoryId(Long categoryId);

    @Query("SELECT m FROM AdminMenu m WHERE m.korName LIKE %:query% OR m.engName LIKE %:query%")
    List<MenuEntity> findByQuery(@Param("query") String query);

    @Query("SELECT m FROM AdminMenu m WHERE m.categoryId = :categoryId AND (m.korName LIKE %:query% OR m.engName LIKE %:query%)")
    List<MenuEntity> findByCategoryIdAndQuery(@Param("categoryId") Long categoryId, @Param("query") String query);
}
