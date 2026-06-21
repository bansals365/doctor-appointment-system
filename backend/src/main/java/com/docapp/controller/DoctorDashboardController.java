package com.docapp.controller;

import com.docapp.dto.request.SetAvailabilityRequest;
import com.docapp.dto.response.ApiResponse;
import com.docapp.dto.response.AppointmentResponse;
import com.docapp.dto.response.DoctorResponse;
import com.docapp.dto.response.SlotResponse;
import com.docapp.security.UserPrincipal;
import com.docapp.service.AppointmentService;
import com.docapp.service.DoctorService;
import com.docapp.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
@RequiredArgsConstructor
public class DoctorDashboardController {

    private final AppointmentService appointmentService;
    private final SlotService slotService;
    private final DoctorService doctorService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<DoctorResponse>> profile(@AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getDoctorByUserId(p.getId())));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> appointments(
            @AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success(
                appointmentService.getDoctorAppointments(p.getId())));
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                appointmentService.updateAppointmentStatus(id, body.get("status"), p.getId())));
    }

    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> mySlots(@AuthenticationPrincipal UserPrincipal p) {
        DoctorResponse doc = doctorService.getDoctorByUserId(p.getId());
        return ResponseEntity.ok(ApiResponse.success(slotService.getDoctorSlots(doc.getId())));
    }

    @PostMapping("/slots")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> addSlots(
            @Valid @RequestBody SetAvailabilityRequest req,
            @AuthenticationPrincipal UserPrincipal p) {
        return ResponseEntity.ok(ApiResponse.success("Slots added", slotService.addSlots(p.getId(), req)));
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<ApiResponse<Void>> deleteSlot(
            @PathVariable Long slotId,
            @AuthenticationPrincipal UserPrincipal p) {
        slotService.deleteSlot(slotId, p.getId());
        return ResponseEntity.ok(ApiResponse.success("Slot deleted", null));
    }
}
