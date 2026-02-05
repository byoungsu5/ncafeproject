package com.new_cafe.app.backend.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuImage {
    private Long id;
    private Long menuId;
    private String srcUrl;
    private LocalDateTime createdAt;
    private Integer sortOrder;
}
