package com.docapp.service;

import com.docapp.dto.request.SetAvailabilityRequest;
import com.docapp.dto.response.SlotResponse;
import com.docapp.exception.ResourceNotFoundException;
import com.docapp.exception.UnauthorizedException;
import com.docapp.model.Doctor;
import com.docapp.model.TimeSlot;
import com.docapp.repository.DoctorRepository;
import com.docapp.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final TimeSlotRepository slotRepository;
    private final DoctorRepository doctorRepository;

    public List<SlotResponse> getAvailableSlots(Long doctorId, LocalDate date) {
        return slotRepository.findByDoctorIdAndSlotDateAndIsAvailableTrue(doctorId, date)
                .stream().filter(s -> !s.getIsBooked())
                .map(SlotResponse::from).toList();
    }

    public List<SlotResponse> getDoctorSlots(Long doctorId) {
        return slotRepository.findByDoctorId(doctorId)
                .stream().map(SlotResponse::from).toList();
    }

    @Transactional
    public List<SlotResponse> addSlots(Long userId, SetAvailabilityRequest req) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));

        List<TimeSlot> slots = req.getSlots().stream().map(s ->
                TimeSlot.builder()
                        .doctor(doctor)
                        .slotDate(req.getDate())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .isBooked(false)
                        .isAvailable(true)
                        .build()
        ).toList();

        return slotRepository.saveAll(slots).stream().map(SlotResponse::from).toList();
    }

    @Transactional
    public void deleteSlot(Long slotId, Long userId) {
        TimeSlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (!slot.getDoctor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Cannot delete another doctor's slot");
        }
        if (slot.getIsBooked()) {
            throw new IllegalArgumentException("Cannot delete a booked slot");
        }

        slotRepository.delete(slot);
    }
}
