package com.portal.appointment.controller;

import com.portal.appointment.entity.*;
import com.portal.appointment.repository.StudentRepository;
import com.portal.appointment.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private StudentRepository studentRepository;

    // ---- Image 2: Student Dashboard, "Browse Faculty" tab ----
    // Also backs the new search feature: ?q=<term> filters by staff name or department
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(required = false) String q,
                             HttpSession session, Model model) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        List<Staff> staffList = staffService.search(q);
        model.addAttribute("staffList", staffList);
        model.addAttribute("query", q == null ? "" : q);
        model.addAttribute("studentName", student.getName());

        // give each staff card their open slots so "Book Appointment" has something to submit
        model.addAttribute("availabilityService", availabilityService);
        return "student/dashboard";
    }

    // ---- Image 2 continued: "My Appointments" tab ----
    @GetMapping("/appointments")
    public String myAppointments(HttpSession session, Model model) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        model.addAttribute("appointments", appointmentService.getForStudent(student));
        model.addAttribute("studentName", student.getName());
        return "student/appointments";
    }

    @PostMapping("/book")
    public String bookAppointment(@RequestParam Long staffId,
                                   @RequestParam Long availabilityId,
                                   @RequestParam String purpose,
                                   HttpSession session) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        Staff staff = staffService.getById(staffId);
        Availability availability = availabilityService.getById(availabilityId);
        appointmentService.book(student, staff, availability, purpose);
        return "redirect:/student/appointments";
    }

    @PostMapping("/rate")
    public String rateAppointment(@RequestParam Long appointmentId,
                                   @RequestParam int rating,
                                   HttpSession session) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        Appointment appointment = appointmentService.getById(appointmentId);
        appointmentService.rateAppointment(appointment, rating);
        return "redirect:/student/appointments";
    }

    private Student requireStudent(HttpSession session) {
        Long studentId = (Long) session.getAttribute("studentId");
        if (studentId == null) return null;
        return studentRepository.findById(studentId).orElse(null);
    }
}
