package com.portal.appointment.controller;

import com.portal.appointment.entity.Appointment;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.service.AppointmentService;
import com.portal.appointment.service.StaffService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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

    // Admin Dashboard: System stats, faculty breakdown, and flagged appointments
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

        // Per-staff appointment counts
        Map<Long, Long> countsByStaff = all.stream()
                .filter(a -> a.getStaff() != null && a.getStaff().getId() != null)
                .collect(Collectors.groupingBy(a -> a.getStaff().getId(), Collectors.counting()));

        model.addAttribute("totalAppointments", totalAppointments);
        model.addAttribute("avgRating", Math.round(avgRating * 10.0) / 10.0);
        model.addAttribute("staffList", staffList);
        model.addAttribute("countsByStaff", countsByStaff);
        model.addAttribute("flagged", appointmentService.getFlagged());
        return "admin/dashboard";
    }

    // Manual trigger for 48-hour escalation scan
    @PostMapping("/check-overdue")
    public String checkOverdue(HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("adminId") == null) return "redirect:/login/admin";
        int newlyFlagged = appointmentService.flagOverdueAppointments();
        redirectAttributes.addFlashAttribute("success", "Escalation check complete. Overdue appointments flagged: " + newlyFlagged);
        return "redirect:/admin/dashboard";
    }

    // Clear flag on reviewed appointment
    @PostMapping("/flagged/{id}/resolve")
    public String resolveFlag(@PathVariable Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (session.getAttribute("adminId") == null) return "redirect:/login/admin";
        appointmentService.clearFlag(appointmentService.getById(id));
        redirectAttributes.addFlashAttribute("success", "Flag resolved for appointment #" + id);
        return "redirect:/admin/dashboard";
    }
}
