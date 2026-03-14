package com.new_cafe.app.backend.admin.menu.adapter.out.persistence.jpa;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

@Entity(name = "AdminMenuImage")
@Table(name = "menu_images")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_id")
    private Long menuId;

    @Column(name = "src_url")
    private String srcUrl;

    @Column(name = "is_primary")
    private Boolean isPrimary;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
