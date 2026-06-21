package com.docapp.controller;

import com.docapp.dto.response.ApiResponse;
import com.docapp.dto.response.DoctorResponse;
import com.docapp.dto.response.SlotResponse;
import com.docapp.service.DoctorService;
import com.docapp.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final SlotService slotService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long specId,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.searchDoctors(name, specId, location)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.getDoctorById(id)));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<ApiResponse<List<SlotResponse>>> getSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(ApiResponse.success(slotService.getAvailableSlots(id, date)));
    }
}
