package com.docapp.service;

import com.docapp.dto.request.DoctorRequest;
import com.docapp.dto.response.DoctorResponse;
import com.docapp.exception.ResourceNotFoundException;
import com.docapp.model.Doctor;
import com.docapp.model.Specialization;
import com.docapp.model.User;
import com.docapp.repository.DoctorRepository;
import com.docapp.repository.SpecializationRepository;
import com.docapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    public List<DoctorResponse> searchDoctors(String name, Long specId, String location) {
        return doctorRepository.searchDoctors(name, specId, location)
                .stream().map(DoctorResponse::from).toList();
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return DoctorResponse.from(doctor);
    }

    public DoctorResponse getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
        return DoctorResponse.from(doctor);
    }

    @Transactional
    public DoctorResponse createDoctor(DoctorRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.DOCTOR)
                .build();
        userRepository.save(user);

        Specialization spec = null;
        if (req.getSpecializationId() != null) {
            spec = specializationRepository.findById(req.getSpecializationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));
        }

        Doctor doctor = Doctor.builder()
                .user(user).specialization(spec)
                .experience(req.getExperience()).fees(req.getFees())
                .bio(req.getBio()).location(req.getLocation())
                .profileImage(req.getProfileImage()).isActive(true)
                .build();

        return DoctorResponse.from(doctorRepository.save(doctor));
    }

    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest req) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        User user = doctor.getUser();
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        userRepository.save(user);

        if (req.getSpecializationId() != null) {
            Specialization spec = specializationRepository.findById(req.getSpecializationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Specialization not found"));
            doctor.setSpecialization(spec);
        }

        doctor.setExperience(req.getExperience());
        doctor.setFees(req.getFees());
        doctor.setBio(req.getBio());
        doctor.setLocation(req.getLocation());
        if (req.getProfileImage() != null) doctor.setProfileImage(req.getProfileImage());

        return DoctorResponse.from(doctorRepository.save(doctor));
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        doctor.setIsActive(false);
        doctorRepository.save(doctor);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll().stream().map(DoctorResponse::from).toList();
    }
}
