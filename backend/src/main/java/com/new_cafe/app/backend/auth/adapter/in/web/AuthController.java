package com.new_cafe.app.backend.auth.adapter.in.web;

import com.new_cafe.app.backend.auth.application.port.in.LoginUseCase;
import com.new_cafe.app.backend.auth.application.port.in.SignupUseCase;
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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginUseCase.LoginCommand command = new LoginUseCase.LoginCommand(request.username(), request.password());
        String token = loginUseCase.login(command);
        
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            signupUseCase.signup(new SignupUseCase.SignupCommand(request.username(), request.password()));
            return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
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

    // DTOs (Inner records or separate files)
    public record LoginRequest(String username, String password) {}
    public record LoginResponse(String token) {}
    public record SignupRequest(String username, String password) {}
}
