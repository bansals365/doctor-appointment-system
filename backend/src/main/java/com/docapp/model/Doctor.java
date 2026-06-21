package com.docapp.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "specialization_id")
    private Specialization specialization;

    private Integer experience;

    private Double fees;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    private Double rating = 0.0;

    private String profileImage;

    @Column(nullable = false)
    private Boolean isActive = true;
}
