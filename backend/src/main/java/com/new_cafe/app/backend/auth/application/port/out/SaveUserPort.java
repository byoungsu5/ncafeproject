package com.new_cafe.app.backend.auth.application.port.out;

import com.new_cafe.app.backend.auth.domain.AuthUser;

public interface SaveUserPort {
    void save(AuthUser user);
}
