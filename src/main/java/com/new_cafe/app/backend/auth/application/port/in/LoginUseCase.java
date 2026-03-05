package com.new_cafe.app.backend.auth.application.port.in;

public interface LoginUseCase {
    String login(LoginCommand command); // JWT 토큰 등을 반환한다고 가정

    record LoginCommand(String username, String password) {}
}
