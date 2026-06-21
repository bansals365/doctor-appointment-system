package com.docapp.repository;

import com.docapp.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderBySlotSlotDateAscSlotStartTimeAsc(Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.slot.slotDate = :date")
    List<Appointment> findByDoctorIdAndDate(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);

    long countByStatus(Appointment.Status status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.id = :doctorId")
    long countByDoctorId(@Param("doctorId") Long doctorId);
}
