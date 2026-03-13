package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;
 
import java.util.List;
import java.util.Optional;
 
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
 
@Repository("adminMenuJpaRepository")
public interface MenuJpaRepository extends JpaRepository<MenuEntity, Long> {
 
    @EntityGraph(attributePaths = {"category", "options", "options.items"})
    Optional<MenuEntity> findById(Long id);
 
    @EntityGraph(attributePaths = {"category", "options"})
    List<MenuEntity> findByCategoryId(Long categoryId);
 
    @EntityGraph(attributePaths = {"category", "options"})
    @Query("SELECT m FROM AdminMenu m WHERE m.korName LIKE %:query% OR m.engName LIKE %:query%")
    List<MenuEntity> findByQuery(@Param("query") String query);
 
    @EntityGraph(attributePaths = {"category", "options"})
    @Query("SELECT m FROM AdminMenu m WHERE m.categoryId = :categoryId AND (m.korName LIKE %:query% OR m.engName LIKE %:query%)")
    List<MenuEntity> findByCategoryIdAndQuery(@Param("categoryId") Long categoryId, @Param("query") String query);
 
    @EntityGraph(attributePaths = {"category", "options"})
    List<MenuEntity> findAll();
}
