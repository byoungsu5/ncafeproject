package com.new_cafe.app.backend.admin.menu.application.command;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
 
public record UpdateMenuCommand(
        Long id,
        @NotBlank(message = "한글 메뉴명을 입력해주세요") String korName,
        @NotBlank(message = "영문 메뉴명을 입력해주세요") String engName,
        String slug,
        String description,
        @NotNull(message = "가격을 입력해주세요") @Min(value = 0, message = "가격은 0원 이상이어야 합니다") Integer price,
        @NotNull(message = "카테고리를 선택해주세요") Long categoryId,
        Boolean isAvailable,
        Boolean isSoldOut,
        List<OptionCommand> options
) {}
