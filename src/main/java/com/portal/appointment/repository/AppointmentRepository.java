package com.portal.appointment.repository;

import com.portal.appointment.entity.Appointment;
import com.portal.appointment.entity.AppointmentStatus;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByStudentOrderByCreatedAtDesc(Student student);
    List<Appointment> findByStaffOrderByCreatedAtDesc(Staff staff);
    List<Appointment> findByStaffAndStatus(Staff staff, AppointmentStatus status);
    List<Appointment> findByFlaggedTrue();

    // used by the escalation scheduler: still pending and older than the cutoff
    List<Appointment> findByStatusAndCreatedAtBeforeAndFlaggedFalse(
            AppointmentStatus status, LocalDateTime cutoff);
}
