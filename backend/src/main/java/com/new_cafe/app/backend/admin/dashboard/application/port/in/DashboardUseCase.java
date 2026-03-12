package com.new_cafe.app.backend.admin.dashboard.application.port.in;

import com.new_cafe.app.backend.admin.dashboard.application.dto.DashboardResponse;

public interface DashboardUseCase {
    DashboardResponse getDashboardStats();
}
