package com.new_cafe.app.backend.admin.menu.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOption {
    private Long id;
    private String name;
    private String type; // SINGLE, MULTIPLE
    private Boolean isRequired;
    private Integer sortOrder;
    private List<OptionItem> items;
}
