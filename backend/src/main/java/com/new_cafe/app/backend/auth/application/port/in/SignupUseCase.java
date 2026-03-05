package com.new_cafe.app.backend.auth.application.port.in;

public interface SignupUseCase {
    void signup(SignupCommand command);

    record SignupCommand(String username, String password) {}
}
