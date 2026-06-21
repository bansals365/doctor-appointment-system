package com.docapp.repository;

import com.docapp.model.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
    boolean existsByName(String name);
}
