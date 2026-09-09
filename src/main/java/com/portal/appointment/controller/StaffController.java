package com.portal.appointment.controller;

import com.portal.appointment.entity.Appointment;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.repository.StaffRepository;
import com.portal.appointment.service.AppointmentService;
import com.portal.appointment.service.AvailabilityService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/staff")
public class StaffController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private StaffRepository staffRepository;

    // Faculty Dashboard: "Appointment Requests" tab
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Staff staff = requireStaff(session);
        if (staff == null) return "redirect:/login/staff";

        model.addAttribute("appointments", appointmentService.getForStaff(staff));
        model.addAttribute("staffName", staff.getName());
        return "staff/dashboard";
    }

    // Faculty Dashboard: "My Availability" tab
    @GetMapping("/availability")
    public String availability(HttpSession session, Model model) {
        Staff staff = requireStaff(session);
        if (staff == null) return "redirect:/login/staff";

        model.addAttribute("slots", availabilityService.getForStaff(staff));
        model.addAttribute("staffName", staff.getName());
        return "staff/availability";
    }

    @PostMapping("/availability/add")
    public String addSlot(@RequestParam String dayOfWeek,
                          @RequestParam String timeSlot,
                          HttpSession session,
                          RedirectAttributes redirectAttributes) {
        Staff staff = requireStaff(session);
        if (staff == null) return "redirect:/login/staff";

        availabilityService.addSlot(staff, dayOfWeek, timeSlot);
        redirectAttributes.addFlashAttribute("success", "Availability slot added successfully!");
        return "redirect:/staff/availability";
    }

    @PostMapping("/appointments/{id}/accept")
    public String accept(@PathVariable Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (requireStaff(session) == null) return "redirect:/login/staff";
        appointmentService.accept(appointmentService.getById(id));
        redirectAttributes.addFlashAttribute("success", "Appointment accepted.");
        return "redirect:/staff/dashboard";
    }

    @PostMapping("/appointments/{id}/decline")
    public String decline(@PathVariable Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (requireStaff(session) == null) return "redirect:/login/staff";
        appointmentService.decline(appointmentService.getById(id));
        redirectAttributes.addFlashAttribute("success", "Appointment declined and time slot released.");
        return "redirect:/staff/dashboard";
    }

    @PostMapping("/appointments/{id}/complete")
    public String complete(@PathVariable Long id,
                           @RequestParam(required = false) String remarks,
                           HttpSession session,
                           RedirectAttributes redirectAttributes) {
        if (requireStaff(session) == null) return "redirect:/login/staff";
        Appointment appointment = appointmentService.getById(id);
        appointmentService.complete(appointment, remarks);
        redirectAttributes.addFlashAttribute("success", "Appointment marked as completed.");
        return "redirect:/staff/dashboard";
    }

    private Staff requireStaff(HttpSession session) {
        Long staffId = (Long) session.getAttribute("staffId");
        if (staffId == null) return null;
        return staffRepository.findById(staffId).orElse(null);
    }
}
