package com.docapp.dto.response;

import com.docapp.model.Doctor;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class DoctorResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private Long specializationId;
    private Integer experience;
    private Double fees;
    private String bio;
    private String location;
    private Double rating;
    private String profileImage;
    private Boolean isActive;

    public static DoctorResponse from(Doctor d) {
        return DoctorResponse.builder()
                .id(d.getId())
                .userId(d.getUser().getId())
                .name(d.getUser().getName())
                .email(d.getUser().getEmail())
                .phone(d.getUser().getPhone())
                .specialization(d.getSpecialization() != null ? d.getSpecialization().getName() : null)
                .specializationId(d.getSpecialization() != null ? d.getSpecialization().getId() : null)
                .experience(d.getExperience())
                .fees(d.getFees())
                .bio(d.getBio())
                .location(d.getLocation())
                .rating(d.getRating())
                .profileImage(d.getProfileImage())
                .isActive(d.getIsActive())
                .build();
    }
}
