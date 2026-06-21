package com.docapp.service;

import com.docapp.dto.response.AdminStatsResponse;
import com.docapp.model.Appointment;
import com.docapp.model.User;
import com.docapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final PaymentRepository paymentRepository;

    public AdminStatsResponse getStats() {
        long totalPatients = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.PATIENT).count();

        return AdminStatsResponse.builder()
                .totalDoctors(doctorRepository.countByIsActive(true))
                .totalPatients(totalPatients)
                .totalAppointments(appointmentRepository.count())
                .pendingAppointments(appointmentRepository.countByStatus(Appointment.Status.PENDING))
                .completedAppointments(appointmentRepository.countByStatus(Appointment.Status.COMPLETED))
                .totalRevenue(paymentRepository.getTotalRevenue())
                .build();
    }
}
