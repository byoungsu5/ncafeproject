package com.new_cafe.app.menu.application.service;

import com.new_cafe.app.menu.application.port.in.MenuUseCase;
import com.new_cafe.app.menu.application.port.out.MenuRepository;
import com.new_cafe.app.menu.domain.model.Menu;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuManagementService implements MenuUseCase {
    
    private final MenuRepository menuRepository;

    @Override
    public List<Menu> getMenuList(Integer categoryId, String searchQuery) {
        return menuRepository.findAll(categoryId, searchQuery);
    }

    @Override
    public Menu getMenuDetail(Long id) {
        return menuRepository.findById(id);
    }
}
