package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveUserPort;
import com.new_cafe.app.backend.auth.config.JwtTokenProvider;
import com.new_cafe.app.backend.auth.domain.AuthUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class AuthService implements LoginUseCase, SignupUseCase {

    private final LoadUserPort loadUserPort;
    private final SaveUserPort saveUserPort;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(LoadUserPort loadUserPort, SaveUserPort saveUserPort,
                       PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.loadUserPort = loadUserPort;
        this.saveUserPort = saveUserPort;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    public String login(LoginCommand command) {
        AuthUser user = loadUserPort.loadUserByUsername(command.username())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(command.password(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtTokenProvider.generateToken(user.getUsername(), user.getRole());
    }

    @Override
    public void signup(SignupCommand command) {
        if (loadUserPort.loadUserByUsername(command.username()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        String encodedPassword = passwordEncoder.encode(command.password());

        AuthUser user = new AuthUser(
            UUID.randomUUID().toString(),
            command.username(),
            encodedPassword,
            "ROLE_USER"
        );

        saveUserPort.save(user);
    }
}
