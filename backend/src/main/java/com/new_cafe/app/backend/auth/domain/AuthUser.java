package com.new_cafe.app.backend.auth.domain;

import java.util.List;

public class AuthUser {
    private final String id;
    private final String username;
    private final String password; // 실제로는 암호화된 비밀번호
    private final String role;

    public AuthUser(String id, String username, String password, String role) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    // Getter only (불변 객체 권장)
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
}
