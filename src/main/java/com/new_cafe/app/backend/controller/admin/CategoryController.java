package com.new_cafe.app.backend.controller.admin;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.new_cafe.app.backend.entity.Category;
import com.new_cafe.app.backend.service.CategoryService;

@RestController
@RequestMapping("/api")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/admin/categories")
    public List<Category> categories() {
        return categoryService.getAll();
    }

    @GetMapping("/admin/categories/{id}")
    public ResponseEntity<String> detail(@PathVariable Long id) {
        return ResponseEntity.ok("Detail view for category " + id + " is handled by frontend");
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<String> newCategory(Category category) {
        // Implementation here
        return ResponseEntity.ok("Category create request received");
    }

    @PutMapping("/admin/categories/{id}")
    public ResponseEntity<String> editCategory(@PathVariable Long id, Category category) {
        // Implementation here
        return ResponseEntity.ok("Category update request received for " + id);
    }

    @DeleteMapping("/admin/categories/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Long id) {
        // Implementation here
        return ResponseEntity.ok("Category delete request received for " + id);
    }
}
