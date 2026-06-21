package com.docapp.dto.response;

import com.docapp.model.TimeSlot;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data @Builder
public class SlotResponse {
    private Long id;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isBooked;
    private Boolean isAvailable;

    public static SlotResponse from(TimeSlot s) {
        return SlotResponse.builder()
                .id(s.getId())
                .slotDate(s.getSlotDate())
                .startTime(s.getStartTime())
                .endTime(s.getEndTime())
                .isBooked(s.getIsBooked())
                .isAvailable(s.getIsAvailable())
                .build();
    }
}
