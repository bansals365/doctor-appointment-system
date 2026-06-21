package com.docapp.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class SetAvailabilityRequest {
    @NotNull
    private LocalDate date;

    @NotNull
    private List<SlotTime> slots;

    @Data
    public static class SlotTime {
        @NotNull
        private LocalTime startTime;
        @NotNull
        private LocalTime endTime;
    }
}
