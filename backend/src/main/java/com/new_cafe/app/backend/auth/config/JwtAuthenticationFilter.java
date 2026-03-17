package com.new_cafe.app.backend.auth.config;

import com.new_cafe.app.backend.auth.application.port.out.LoadUserPort;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final LoadUserPort loadUserPort;
    private final JwtTokenProvider jwtTokenProvider;

    public JwtAuthenticationFilter(LoadUserPort loadUserPort, JwtTokenProvider jwtTokenProvider) {
        this.loadUserPort = loadUserPort;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("[JwtAuthenticationFilter] Token received for path: " + request.getRequestURI());

            if (jwtTokenProvider.validateToken(token)) {
                String username = jwtTokenProvider.getUsername(token);

                loadUserPort.loadUserByUsername(username).ifPresent(user -> {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(user.getRole());

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user.getUsername(), null, Collections.singletonList(authority));

                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("[JwtAuthenticationFilter] Authenticated user: " + username);
                });
            } else {
                System.err.println("[JwtAuthenticationFilter] Invalid token for path: " + request.getRequestURI());
            }
        }

        filterChain.doFilter(request, response);
    }
}
