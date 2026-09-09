package com.portal.appointment.controller;

import com.portal.appointment.entity.*;
import com.portal.appointment.repository.StudentRepository;
import com.portal.appointment.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

    // Student Dashboard: "Browse Faculty" tab with search feature (?q=<term>)
    @GetMapping("/dashboard")
    public String dashboard(@RequestParam(required = false) String q,
                            HttpSession session, Model model) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        List<Staff> staffList = staffService.search(q);
        model.addAttribute("staffList", staffList);
        model.addAttribute("query", q == null ? "" : q);
        model.addAttribute("studentName", student.getName());
        model.addAttribute("availabilityService", availabilityService);
        return "student/dashboard";
    }

    // "My Appointments" tab
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
                                  HttpSession session,
                                  RedirectAttributes redirectAttributes) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        Staff staff = staffService.getById(staffId);
        Availability availability = availabilityService.getById(availabilityId);
        appointmentService.book(student, staff, availability, purpose);
        redirectAttributes.addFlashAttribute("success", "Appointment requested successfully!");
        return "redirect:/student/appointments";
    }

    @PostMapping("/rate")
    public String rateAppointment(@RequestParam Long appointmentId,
                                  @RequestParam int rating,
                                  HttpSession session,
                                  RedirectAttributes redirectAttributes) {
        Student student = requireStudent(session);
        if (student == null) return "redirect:/login/student";

        Appointment appointment = appointmentService.getById(appointmentId);
        appointmentService.rateAppointment(appointment, rating);
        redirectAttributes.addFlashAttribute("success", "Thank you for submitting your rating!");
        return "redirect:/student/appointments";
    }

    private Student requireStudent(HttpSession session) {
        Long studentId = (Long) session.getAttribute("studentId");
        if (studentId == null) return null;
        return studentRepository.findById(studentId).orElse(null);
    }
}
