package com.new_cafe.app.backend.menu.adapter.out.persistence;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MenuJpaRepository extends JpaRepository<MenuEntity, Long> {

    @EntityGraph(attributePaths = {"category"})
    Optional<MenuEntity> findByIdAndIsAvailableTrue(Long id);

    @EntityGraph(attributePaths = {"category"})
    List<MenuEntity> findByIsAvailableTrue();

    @EntityGraph(attributePaths = {"category"})
    List<MenuEntity> findByIsAvailableTrueAndCategoryId(Long categoryId);
    // 활성화된 메뉴 중 특정 카테고리에 속하는 메뉴 목록을 조회

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT m FROM UserMenu m WHERE m.isAvailable = true AND (m.korName LIKE %:query% OR m.engName LIKE %:query%)")
    List<MenuEntity> findAllAvailableByQuery(@Param("query") String query);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT m FROM UserMenu m WHERE m.isAvailable = true AND m.categoryId = :categoryId AND (m.korName LIKE %:query% OR m.engName LIKE %:query%)")
    List<MenuEntity> findAllAvailableByCategoryIdAndQuery(@Param("categoryId") Long categoryId, @Param("query") String query);
}
