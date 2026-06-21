package com.docapp.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookAppointmentRequest {
    @NotNull
    private Long slotId;

    private String notes;
}
