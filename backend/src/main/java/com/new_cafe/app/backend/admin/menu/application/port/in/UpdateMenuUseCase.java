package com.new_cafe.app.backend.admin.menu.application.port.in;

import com.new_cafe.app.backend.admin.menu.application.command.UpdateMenuCommand;
import com.new_cafe.app.backend.admin.menu.application.result.MenuResult;

public interface UpdateMenuUseCase {
    MenuResult updateMenu(UpdateMenuCommand command);
}
