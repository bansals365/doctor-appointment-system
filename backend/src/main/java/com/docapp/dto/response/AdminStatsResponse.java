package com.docapp.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data @Builder
public class AdminStatsResponse {
    private long totalDoctors;
    private long totalPatients;
    private long totalAppointments;
    private long pendingAppointments;
    private long completedAppointments;
    private BigDecimal totalRevenue;
}
