package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.repository.CategoryRepository;

@RestController
@RequestMapping("/api")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("/admin/categories")
    public List<Category> categories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/admin/categories/{id}")
    public ResponseEntity<Category> detail(@PathVariable Long id) {
        Category category = categoryRepository.findById(id);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<Category> newCategory(@RequestBody Category category) {
        categoryRepository.save(category);
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<Category> editCategory(@PathVariable Long id, @RequestBody Category category) {
        if (categoryRepository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        category.setId(id);
        categoryRepository.update(category);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        if (categoryRepository.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.delete(id);
        return ResponseEntity.noContent().build();
    }
}
