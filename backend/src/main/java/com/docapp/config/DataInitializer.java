package com.docapp.config;

import com.docapp.model.Specialization;
import com.docapp.model.User;
import com.docapp.repository.SpecializationRepository;
import com.docapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SpecializationRepository specializationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedSpecializations();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@docapp.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@docapp.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin@docapp.com / admin123");
        }
    }

    private void seedSpecializations() {
        if (specializationRepository.count() == 0) {
            List<String> names = List.of(
                    "Cardiologist", "Dermatologist", "Neurologist", "Orthopedist",
                    "Pediatrician", "Psychiatrist", "Gynecologist", "ENT Specialist",
                    "Ophthalmologist", "General Physician", "Diabetologist", "Urologist"
            );
            names.forEach(name ->
                    specializationRepository.save(Specialization.builder().name(name).build())
            );
            log.info("Specializations seeded: {} entries", names.size());
        }
    }
}
