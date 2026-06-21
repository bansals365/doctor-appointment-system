package com.docapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"doctor_id", "slot_date", "start_time"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Boolean isBooked = false;

    @Column(nullable = false)
    private Boolean isAvailable = true;
}
