package com.new_cafe.app.backend.admin.dashboard.adapter.in.web;

import com.new_cafe.app.backend.admin.dashboard.application.dto.DashboardResponse;
import com.new_cafe.app.backend.admin.dashboard.application.port.in.DashboardUseCase;
import lombok.RequiredArgsConstructor;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardUseCase dashboardUseCase;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("[AdminDashboardController] Fetching stats...");
            DashboardResponse stats = dashboardUseCase.getDashboardStats();
            System.out.println("[AdminDashboardController] Stats fetched successfully");
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("[AdminDashboardController] Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}
