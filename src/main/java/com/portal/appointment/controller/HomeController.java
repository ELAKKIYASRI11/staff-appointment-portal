package com.portal.appointment.controller;

import com.portal.appointment.entity.Admin;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.entity.Student;
import com.portal.appointment.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
public class HomeController {

    @Autowired
    private AuthService authService;

    // Image 1: role selection landing page
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login/{role}")
    public String loginPage(@PathVariable String role, Model model) {
        model.addAttribute("role", role);
        return "login";
    }

    @PostMapping("/login/{role}")
    public String doLogin(@PathVariable String role,
                           @RequestParam String email,
                           @RequestParam String password,
                           HttpSession session,
                           Model model) {
        switch (role) {
            case "student" -> {
                Optional<Student> student = authService.loginStudent(email, password);
                if (student.isPresent()) {
                    session.setAttribute("studentId", student.get().getId());
                    session.setAttribute("studentName", student.get().getName());
                    return "redirect:/student/dashboard";
                }
            }
            case "staff" -> {
                Optional<Staff> staff = authService.loginStaff(email, password);
                if (staff.isPresent()) {
                    session.setAttribute("staffId", staff.get().getId());
                    session.setAttribute("staffName", staff.get().getName());
                    return "redirect:/staff/dashboard";
                }
            }
            case "admin" -> {
                Optional<Admin> admin = authService.loginAdmin(email, password);
                if (admin.isPresent()) {
                    session.setAttribute("adminId", admin.get().getId());
                    return "redirect:/admin/dashboard";
                }
            }
        }
        model.addAttribute("role", role);
        model.addAttribute("error", "Invalid email or password");
        return "login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
