package com.portal.appointment;

import com.portal.appointment.entity.*;
import com.portal.appointment.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class PortalIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private AppointmentService appointmentService;

    @Test
    void testStudentRegistrationAndLogin() {
        String testEmail = "test.student." + System.currentTimeMillis() + "@college.edu";
        Student registered = authService.registerStudent("Test Student", testEmail, "password123", "REG101");
        assertNotNull(registered.getId());
        assertEquals("Test Student", registered.getName());

        Optional<Student> loggedIn = authService.loginStudent(testEmail, "password123");
        assertTrue(loggedIn.isPresent());
        assertEquals(registered.getId(), loggedIn.get().getId());
    }

    @Test
    void testStaffRegistrationAndLogin() {
        String testEmail = "test.faculty." + System.currentTimeMillis() + "@college.edu";
        List<Department> deps = authService.getAllDepartments();
        assertFalse(deps.isEmpty());

        Staff registered = authService.registerStaff("Dr. Test Faculty", testEmail, "facpass123", deps.get(0).getId());
        assertNotNull(registered.getId());
        assertEquals("Dr. Test Faculty", registered.getName());
        assertEquals(deps.get(0).getId(), registered.getDepartment().getId());

        Optional<Staff> loggedIn = authService.loginStaff(testEmail, "facpass123");
        assertTrue(loggedIn.isPresent());
    }

    @Test
    void testStaffSearch() {
        // Search by name
        List<Staff> byName = staffService.search("Sarah");
        assertFalse(byName.isEmpty());
        assertTrue(byName.stream().anyMatch(s -> s.getName().contains("Sarah")));

        // Search by department
        List<Staff> byDept = staffService.search("Computer");
        assertFalse(byDept.isEmpty());
        assertTrue(byDept.stream().anyMatch(s -> s.getDepartment() != null && s.getDepartment().getName().contains("Computer")));

        // Empty search returns all
        List<Staff> all = staffService.search("");
        assertTrue(all.size() >= 5);
    }

    @Test
    void testAppointmentLifecycle() {
        Optional<Student> studentOpt = authService.loginStudent("john.smith@college.edu", "student123");
        assertTrue(studentOpt.isPresent());
        Student student = studentOpt.get();

        Optional<Staff> staffOpt = authService.loginStaff("sarah.johnson@college.edu", "staff123");
        assertTrue(staffOpt.isPresent());
        Staff staff = staffOpt.get();

        // Add a slot
        Availability slot = availabilityService.addSlot(staff, "FRIDAY", "17:00");
        assertFalse(slot.isBooked());

        // Book appointment
        Appointment appt = appointmentService.book(student, staff, slot, "Thesis Discussion Test");
        assertNotNull(appt.getId());
        assertEquals(AppointmentStatus.PENDING, appt.getStatus());

        // Verify slot is now booked
        Availability reloadedSlot = availabilityService.getById(slot.getId());
        assertTrue(reloadedSlot.isBooked());

        // Staff accepts
        appointmentService.accept(appt);
        Appointment acceptedAppt = appointmentService.getById(appt.getId());
        assertEquals(AppointmentStatus.ACCEPTED, acceptedAppt.getStatus());

        // Staff completes with remarks
        appointmentService.complete(acceptedAppt, "Well prepared and discussed chapters 1-3.");
        Appointment completedAppt = appointmentService.getById(appt.getId());
        assertEquals(AppointmentStatus.COMPLETED, completedAppt.getStatus());
        assertEquals("Well prepared and discussed chapters 1-3.", completedAppt.getRemarks());

        // Student rates
        appointmentService.rateAppointment(completedAppt, 5);
        Appointment ratedAppt = appointmentService.getById(appt.getId());
        assertEquals(5, ratedAppt.getRating());
    }

    @Test
    void testOverdueEscalationCheck() {
        int flagged = appointmentService.flagOverdueAppointments();
        assertTrue(flagged >= 0);
    }
}
