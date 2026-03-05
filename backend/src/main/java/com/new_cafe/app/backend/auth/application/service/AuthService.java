package com.new_cafe.app.backend.auth.application.service;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveUserPort;
import com.new_cafe.app.backend.auth.domain.AuthUser;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService implements LoginUseCase, SignupUseCase {

    private final LoadUserPort loadUserPort;
    private final SaveUserPort saveUserPort;
    private final PasswordEncoder passwordEncoder;

    public AuthService(LoadUserPort loadUserPort, SaveUserPort saveUserPort, PasswordEncoder passwordEncoder) {
        this.loadUserPort = loadUserPort;
        this.saveUserPort = saveUserPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String login(LoginCommand command) {
        // 1. 사용자 조회 (Port 호출)
        AuthUser user = loadUserPort.loadUserByUsername(command.username())
            .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 2. 비밀번호 검증
        if (!passwordEncoder.matches(command.password(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // 3. 토큰 생성 및 반환 (BFF가 기대하는 필드명 'token')
        // TODO: 실제 JWT 라이브러리 연동 필요
        return "dummy-jwt-token-for-" + user.getUsername();
    }

    @Override
    public void signup(SignupCommand command) {
        // 1. 중복 사용자 체크
        if (loadUserPort.loadUserByUsername(command.username()).isPresent()) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(command.password());

        // 3. 사용자 생성 및 저장 (Port 호출)
        AuthUser user = new AuthUser(
            UUID.randomUUID().toString(),
            command.username(),
            encodedPassword,
            "ROLE_USER" // 기본 권한
        );

        saveUserPort.save(user);
    }
}
