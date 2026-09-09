package com.portal.appointment.service;

import com.portal.appointment.entity.*;
import com.portal.appointment.repository.AppointmentHistoryRepository;
import com.portal.appointment.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    // pending appointments older than this get flagged for admin review
    private static final int ESCALATION_HOURS = 48;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentHistoryRepository historyRepository;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private StaffService staffService;

    public Appointment book(Student student, Staff staff, Availability availability, String purpose) {
        Appointment appointment = new Appointment();
        appointment.setStudent(student);
        appointment.setStaff(staff);
        appointment.setAvailability(availability);
        appointment.setPurpose(purpose);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment = appointmentRepository.save(appointment);

        if (availability != null) {
            availabilityService.markBooked(availability);
        }
        logHistory(appointment, "CREATED", student.getName());
        return appointment;
    }

    public void accept(Appointment appointment) {
        appointment.setStatus(AppointmentStatus.ACCEPTED);
        appointment.setRespondedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
        logHistory(appointment, "ACCEPTED", appointment.getStaff().getName());
    }

    public void decline(Appointment appointment) {
        appointment.setStatus(AppointmentStatus.REJECTED);
        appointment.setRespondedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);

        // free up the slot so another student can book it
        if (appointment.getAvailability() != null) {
            availabilityService.release(appointment.getAvailability());
        }
        logHistory(appointment, "REJECTED", appointment.getStaff().getName());
    }

    public void complete(Appointment appointment, String remarks) {
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setRemarks(remarks);
        appointment.setRespondedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
        logHistory(appointment, "COMPLETED", appointment.getStaff().getName());
    }

    public void rateAppointment(Appointment appointment, int rating) {
        appointment.setRating(rating);
        appointmentRepository.save(appointment);
        staffService.updateRating(appointment.getStaff(), rating);
        logHistory(appointment, "RATED (" + rating + "★)", appointment.getStudent().getName());
    }

    /**
     * Escalation: any PENDING appointment older than ESCALATION_HOURS that hasn't
     * already been flagged gets flagged for admin review.
     * Can be invoked manually from admin dashboard or automatically by scheduled job.
     */
    public int flagOverdueAppointments() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(ESCALATION_HOURS);
        List<Appointment> overdue = appointmentRepository
                .findByStatusAndCreatedAtBeforeAndFlaggedFalse(AppointmentStatus.PENDING, cutoff);

        for (Appointment appointment : overdue) {
            appointment.setFlagged(true);
            appointmentRepository.save(appointment);
            logHistory(appointment, "FLAGGED", "SYSTEM");
        }
        log.info("Escalation check completed. Flagged {} overdue appointments.", overdue.size());
        return overdue.size();
    }

    /**
     * Scheduled hourly job that automatically checks and flags overdue appointments
     */
    @Scheduled(cron = "0 0 * * * *")
    public void scheduledFlagOverdueAppointments() {
        flagOverdueAppointments();
    }

    public void clearFlag(Appointment appointment) {
        appointment.setFlagged(false);
        appointmentRepository.save(appointment);
        logHistory(appointment, "FLAG_CLEARED", "ADMIN");
    }

    public List<Appointment> getForStudent(Student student) {
        return appointmentRepository.findByStudentOrderByCreatedAtDesc(student);
    }

    public List<Appointment> getForStaff(Staff staff) {
        return appointmentRepository.findByStaffOrderByCreatedAtDesc(staff);
    }

    public List<Appointment> getFlagged() {
        return appointmentRepository.findByFlaggedTrue();
    }

    public List<Appointment> getAll() {
        return appointmentRepository.findAll();
    }

    public Appointment getById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found: " + id));
    }

    private void logHistory(Appointment appointment, String action, String performedBy) {
        historyRepository.save(new AppointmentHistory(appointment, action, performedBy));
    }
}
