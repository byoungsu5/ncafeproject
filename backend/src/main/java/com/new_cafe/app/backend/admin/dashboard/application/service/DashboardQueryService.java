package com.new_cafe.app.backend.admin.dashboard.application.service;

import com.new_cafe.app.backend.admin.dashboard.application.dto.DailyStat;
import com.new_cafe.app.backend.admin.dashboard.application.dto.DashboardResponse;
import com.new_cafe.app.backend.admin.dashboard.application.port.in.DashboardUseCase;
import com.new_cafe.app.backend.order.adapter.out.persistence.OrderJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardQueryService implements DashboardUseCase {

    private final OrderJpaRepository orderJpaRepository;

    @Override
    public DashboardResponse getDashboardStats() {
        long totalOrderCount = orderJpaRepository.countNonCancelledOrders();
        Long totalRevenue = orderJpaRepository.sumTotalRevenue();
        Long totalSalesVolume = orderJpaRepository.sumTotalSalesVolume();

        List<Object[]> dailyResults = orderJpaRepository.findDailyStats();
        System.out.println("[DashboardQueryService] dailyResults size: " + dailyResults.size());
        
        List<DailyStat> dailyStats = dailyResults.stream()
                .map(row -> {
                    try {
                        String date = row[0] != null ? String.valueOf(row[0]) : "unknown";
                        long count = row[1] != null ? ((Number) row[1]).longValue() : 0L;
                        long revenue = row[2] != null ? ((Number) row[2]).longValue() : 0L;
                        long volume = row[3] != null ? ((Number) row[3]).longValue() : 0L;
                        
                        return DailyStat.builder()
                                .date(date)
                                .orderCount(count)
                                .revenue(revenue)
                                .salesVolume(volume)
                                .build();
                    } catch (Exception e) {
                        System.err.println("[DashboardQueryService] Error mapping row at index: " + dailyResults.indexOf(row));
                        e.printStackTrace();
                        return DailyStat.builder().date("error").build();
                    }
                })
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalOrderCount(totalOrderCount)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0)
                .totalSalesVolume(totalSalesVolume != null ? totalSalesVolume : 0)
                .dailyStats(dailyStats)
                .build();
    }
}
