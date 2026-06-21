package com.docapp.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRequest {
    @NotBlank
    private String name;
    @Email @NotBlank
    private String email;
    private String password;
    private String phone;
    private Long specializationId;
    private Integer experience;
    private Double fees;
    private String bio;
    private String location;
    private String profileImage;
}
