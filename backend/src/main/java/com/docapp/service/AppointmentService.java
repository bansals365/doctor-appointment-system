package com.docapp.service;

import com.docapp.dto.request.BookAppointmentRequest;
import com.docapp.dto.response.AppointmentResponse;
import com.docapp.exception.ResourceNotFoundException;
import com.docapp.exception.SlotAlreadyBookedException;
import com.docapp.exception.UnauthorizedException;
import com.docapp.model.*;
import com.docapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository slotRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public AppointmentResponse bookAppointment(Long patientId, BookAppointmentRequest req) {
        TimeSlot slot = slotRepository.findByIdWithLock(req.getSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));

        if (slot.getIsBooked() || !slot.getIsAvailable()) {
            throw new SlotAlreadyBookedException("This slot is already booked or unavailable");
        }

        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        slot.setIsBooked(true);
        slotRepository.save(slot);

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(slot.getDoctor())
                .slot(slot)
                .status(Appointment.Status.PENDING)
                .notes(req.getNotes())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        // Confirmation email is sent only once the appointment is CONFIRMED (see PaymentService),
        // not here while it is still PENDING payment.

        return AppointmentResponse.from(saved);
    }

    public List<AppointmentResponse> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(AppointmentResponse::from).toList();
    }

    public List<AppointmentResponse> getDoctorAppointments(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return appointmentRepository.findByDoctorIdOrderBySlotSlotDateAscSlotStartTimeAsc(doctor.getId())
                .stream().map(AppointmentResponse::from).toList();
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(AppointmentResponse::from).toList();
    }

    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long patientId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appt.getPatient().getId().equals(patientId)) {
            throw new UnauthorizedException("Cannot cancel another patient's appointment");
        }
        if (appt.getStatus() == Appointment.Status.COMPLETED) {
            throw new IllegalArgumentException("Cannot cancel a completed appointment");
        }

        appt.setStatus(Appointment.Status.CANCELLED);
        appt.getSlot().setIsBooked(false);
        slotRepository.save(appt.getSlot());

        emailService.sendCancellationEmail(appt.getPatient().getEmail(),
                appt.getPatient().getName(), appt.getDoctor().getUser().getName());

        return AppointmentResponse.from(appointmentRepository.save(appt));
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, String status, Long userId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (!appt.getDoctor().getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Cannot update another doctor's appointment");
        }

        appt.setStatus(Appointment.Status.valueOf(status.toUpperCase()));
        return AppointmentResponse.from(appointmentRepository.save(appt));
    }
}
