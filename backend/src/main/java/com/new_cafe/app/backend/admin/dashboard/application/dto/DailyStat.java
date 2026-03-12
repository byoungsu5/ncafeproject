package com.new_cafe.app.backend.admin.dashboard.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStat {
    private String date;         // yyyy-MM-dd
    private long orderCount;
    private long salesVolume;
    private long revenue;
}
