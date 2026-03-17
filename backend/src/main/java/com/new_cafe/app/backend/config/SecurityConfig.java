package com.new_cafe.app.backend.config;

import com.new_cafe.app.backend.auth.config.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // BFF에서 JWT를 헤더로 담아 보내므로 disable
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/login", "/api/auth/signup").permitAll()
                .requestMatchers("/api/admin/images/upload").permitAll()
                .requestMatchers("/upload/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/auth/me").authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(handling -> handling
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                })
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);

        // 사용자 조회: Spring이 기대하는 결과 컬럼 (username, password, enabled) 순서로 나오게 SELECT
        manager.setUsersByUsernameQuery(
            "SELECT nickname AS username, password, true AS enabled FROM users WHERE nickname = ?");

        // 권한 조회: 결과 컬럼 (username, authority). authority 는 ROLE_ 접두사 (예: ROLE_ADMIN)
        manager.setAuthoritiesByUsernameQuery(
            "SELECT nickname AS username, role AS authority FROM users WHERE nickname = ?");

        return manager;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
