package com.portal.appointment.repository;

import com.portal.appointment.entity.Appointment;
import com.portal.appointment.entity.AppointmentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentHistoryRepository extends JpaRepository<AppointmentHistory, Long> {
    List<AppointmentHistory> findByAppointmentOrderByTimestampDesc(Appointment appointment);
}
