package com.new_cafe.app.backend.menu.adapter.out.persistence;

import org.hibernate.annotations.Immutable;

import com.new_cafe.app.backend.menu.domain.Menu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "UserMenu")
@Table(name = "menus")
@Immutable
@Getter
@NoArgsConstructor
public class MenuEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kor_name")
    private String korName;

    @Column(name = "eng_name")
    private String engName;

    private String description;

    private Integer price;

    @Column(name = "category_id", insertable = false, updatable = false)
    private Long categoryId;

    @Column(name = "is_available")
    private Boolean isAvailable;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private CategoryEntity category;

    public Menu toDomain(String imageSrc) {
        String categoryName = (category != null) ? category.getName() : "미지정";
        return Menu.builder()
                .id(id)
                .korName(korName)
                .engName(engName)
                .description(description)
                .price(price)
                .categoryId(categoryId)
                .categoryName(categoryName)
                .isAvailable(isAvailable != null ? isAvailable : true)
                .imageSrc(imageSrc != null ? imageSrc : "blank.png")
                .build();
    }
}
