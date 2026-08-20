package com.portal.appointment.controller;

import com.portal.appointment.entity.Appointment;
import com.portal.appointment.entity.AppointmentStatus;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.service.AppointmentService;
import com.portal.appointment.service.StaffService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private StaffService staffService;

    // ---- Images 5 & 6: Admin Dashboard - stats, per-staff breakdown, flagged appointments ----
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (session.getAttribute("adminId") == null) return "redirect:/login/admin";

        List<Appointment> all = appointmentService.getAll();
        long totalAppointments = all.size();
        double avgRating = all.stream()
                .filter(a -> a.getRating() != null)
                .mapToInt(Appointment::getRating)
                .average()
                .orElse(0.0);

        List<Staff> staffList = staffService.getAllStaff();

        // per-staff appointment counts, for the "Prof. James Miller - 35 appointments" rows
        Map<Long, Long> countsByStaff = all.stream()
                .collect(Collectors.groupingBy(a -> a.getStaff().getId(), Collectors.counting()));

        model.addAttribute("totalAppointments", totalAppointments);
        model.addAttribute("avgRating", Math.round(avgRating * 10.0) / 10.0);
        model.addAttribute("staffList", staffList);
        model.addAttribute("countsByStaff", countsByStaff);
        model.addAttribute("flagged", appointmentService.getFlagged());
        return "admin/dashboard";
    }

    // manual trigger for the 48hr escalation check (in production this would run on a schedule)
    @PostMapping("/check-overdue")
    public String checkOverdue(HttpSession session) {
        if (session.getAttribute("adminId") == null) return "redirect:/login/admin";
        appointmentService.flagOverdueAppointments();
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/flagged/{id}/resolve")
    public String resolveFlag(@PathVariable Long id, HttpSession session) {
        if (session.getAttribute("adminId") == null) return "redirect:/login/admin";
        appointmentService.clearFlag(appointmentService.getById(id));
        return "redirect:/admin/dashboard";
    }
}
