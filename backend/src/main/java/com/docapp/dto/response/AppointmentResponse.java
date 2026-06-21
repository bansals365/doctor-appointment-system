package com.docapp.dto.response;

import com.docapp.model.Appointment;
import com.docapp.model.Payment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data @Builder
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private Long slotId;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private String notes;
    private LocalDateTime createdAt;

    public static AppointmentResponse from(Appointment a) {
        Payment p = a.getPayment();
        // Payments created before the "method" column existed are online ones.
        String payMethod = p == null ? null
                : (p.getMethod() != null ? p.getMethod().name() : "ONLINE");
        String payStatus = p == null || p.getStatus() == null ? null : p.getStatus().name();

        return AppointmentResponse.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getUser().getName())
                .specialization(a.getDoctor().getSpecialization() != null
                        ? a.getDoctor().getSpecialization().getName() : null)
                .slotId(a.getSlot().getId())
                .slotDate(a.getSlot().getSlotDate())
                .startTime(a.getSlot().getStartTime())
                .endTime(a.getSlot().getEndTime())
                .status(a.getStatus().name())
                .paymentMethod(payMethod)
                .paymentStatus(payStatus)
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
