package com.docapp.repository;

import com.docapp.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByDoctorIdAndSlotDateAndIsAvailableTrue(Long doctorId, LocalDate date);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM TimeSlot s WHERE s.id = :id")
    Optional<TimeSlot> findByIdWithLock(@Param("id") Long id);

    List<TimeSlot> findByDoctorId(Long doctorId);
}
