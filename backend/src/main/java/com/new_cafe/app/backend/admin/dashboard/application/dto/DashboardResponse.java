package com.new_cafe.app.backend.admin.dashboard.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long totalOrderCount;    // 전체 주문량
    private long totalSalesVolume;   // 전체 판매량 (아이템 수량 합계)
    private long totalRevenue;       // 전체 판매 수익
    private List<DailyStat> dailyStats; // 최근 일자별 통계
}
