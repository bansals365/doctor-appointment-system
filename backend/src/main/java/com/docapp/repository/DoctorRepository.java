package com.docapp.repository;

import com.docapp.model.Doctor;
import com.docapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    Optional<Doctor> findByUser(User user);

    Optional<Doctor> findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d JOIN d.user u LEFT JOIN d.specialization s " +
           "WHERE d.isActive = true " +
           "AND (:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%')) " +
           "     OR LOWER(s.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
           "AND (:specId IS NULL OR s.id = :specId) " +
           "AND (:location IS NULL OR LOWER(d.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Doctor> searchDoctors(@Param("name") String name,
                               @Param("specId") Long specId,
                               @Param("location") String location);

    long countByIsActive(boolean isActive);
}
