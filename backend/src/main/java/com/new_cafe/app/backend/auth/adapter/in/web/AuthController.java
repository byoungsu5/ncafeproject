package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final LoginUseCase loginUseCase;
    private final SignupUseCase signupUseCase;

    public AuthController(LoginUseCase loginUseCase, SignupUseCase signupUseCase) {
        this.loginUseCase = loginUseCase;
        this.signupUseCase = signupUseCase;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginUseCase.LoginCommand command = new LoginUseCase.LoginCommand(request.username(), request.password());
        String token = loginUseCase.login(command);

        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        signupUseCase.signup(new SignupUseCase.SignupCommand(request.username(), request.password()));
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        return ResponseEntity.ok(Map.of(
            "username", auth.getName(),
            "roles", auth.getAuthorities()
        ));
    }

    public record LoginRequest(
            @NotBlank(message = "아이디를 입력해주세요") String username,
            @NotBlank(message = "비밀번호를 입력해주세요") String password
    ) {}
    public record LoginResponse(String token) {}
    public record SignupRequest(
            @NotBlank(message = "아이디를 입력해주세요") String username,
            @NotBlank(message = "비밀번호를 입력해주세요") String password
    ) {}
}
