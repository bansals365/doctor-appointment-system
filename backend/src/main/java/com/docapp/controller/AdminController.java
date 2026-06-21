package com.docapp.controller;

import com.docapp.dto.request.DoctorRequest;
import com.docapp.dto.response.*;
import com.docapp.model.Specialization;
import com.docapp.repository.SpecializationRepository;
import com.docapp.service.AdminService;
import com.docapp.service.AppointmentService;
import com.docapp.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final SpecializationRepository specializationRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> stats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getStats()));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getAllDoctors()));
    }

    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@Valid @RequestBody DoctorRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Doctor created", doctorService.createDoctor(req)));
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(
            @PathVariable Long id, @Valid @RequestBody DoctorRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.updateDoctor(id, req)));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deactivated", null));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success(appointmentService.getAllAppointments()));
    }

    @GetMapping("/specializations")
    public ResponseEntity<ApiResponse<List<Specialization>>> getSpecializations() {
        return ResponseEntity.ok(ApiResponse.success(specializationRepository.findAll()));
    }

    @PostMapping("/specializations")
    public ResponseEntity<ApiResponse<Specialization>> addSpecialization(@RequestBody Specialization spec) {
        return ResponseEntity.ok(ApiResponse.success("Specialization added",
                specializationRepository.save(spec)));
    }
}
