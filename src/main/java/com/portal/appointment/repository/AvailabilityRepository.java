package com.portal.appointment.repository;

import com.portal.appointment.entity.Availability;
import com.portal.appointment.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByStaff(Staff staff);
    List<Availability> findByStaffAndBookedFalse(Staff staff);
}
