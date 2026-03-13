package com.new_cafe.app.backend.admin.menu.application.command;
 
import java.util.List;
 
public record OptionCommand(
    Long id,
    String name,
    String type,
    Boolean required,
    Integer sortOrder,
    List<OptionItemCommand> items
) {
    public record OptionItemCommand(
        Long id,
        String name,
        Integer priceDelta,
        Integer sortOrder
    ) {}
}
