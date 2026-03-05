package com.new_cafe.app.backend.auth.adapter.out.persistence;

import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import com.new_cafe.app.backend.auth.application.port.out.SaveUserPort;
import com.new_cafe.app.backend.auth.domain.AuthUser;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class AuthPersistenceAdapter implements LoadUserPort, SaveUserPort {

    private final JdbcTemplate jdbc;

    public AuthPersistenceAdapter(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Optional<AuthUser> loadUserByUsername(String username) {
        String sql = "SELECT id, nickname, password, role FROM users WHERE nickname = ?";
        
        return jdbc.query(sql, (rs, rowNum) -> new AuthUser(
            rs.getString("id"),
            rs.getString("nickname"),
            rs.getString("password"),
            rs.getString("role")
        ), username).stream().findFirst();
    }

    @Override
    public void save(AuthUser user) {
        String sql = "INSERT INTO users (id, nickname, password, role) VALUES (?, ?, ?, ?)";
        jdbc.update(sql, 
            user.getId(), 
            user.getUsername(), 
            user.getPassword(), 
            user.getRole()
        );
    }
}
