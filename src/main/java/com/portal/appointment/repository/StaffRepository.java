package com.portal.appointment.repository;

import com.portal.appointment.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmailAndPassword(String email, String password);

    // Search feature: match staff by name OR department name, case-insensitive
    List<Staff> findByNameContainingIgnoreCaseOrDepartment_NameContainingIgnoreCase(
            String name, String departmentName);
}
