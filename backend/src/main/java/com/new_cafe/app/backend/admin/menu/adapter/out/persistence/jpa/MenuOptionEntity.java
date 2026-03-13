package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity(name = "AdminMenuOption")
@Table(name = "menu_options")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuOptionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    private String name;

    private String type; // SINGLE, MULTIPLE

    @Column(name = "is_required")
    private Boolean isRequired;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "option_id")
    @OrderBy("sortOrder ASC")
    @Builder.Default
    private List<OptionItemEntity> items = new ArrayList<>();

    public void update(String name, String type, Boolean isRequired, Integer sortOrder) {
        this.name = name;
        this.type = type;
        this.isRequired = isRequired;
        this.sortOrder = sortOrder;
    }
}
