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
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class HomeController {

    @Autowired
    private AuthService authService;

    // Role selection landing page (with both Login and Register actions)
    @GetMapping("/")
    public String home() {
        return "forward:/index.html";
    }

    // Login Form Display
    @GetMapping("/login/{role}")
    public String loginPage(@PathVariable String role,
                            @RequestParam(required = false) String registered,
                            Model model) {
        model.addAttribute("role", role.toLowerCase());
        if (registered != null) {
            model.addAttribute("success", "Registration successful! Please sign in with your new credentials.");
        }
        return "login";
    }

    // Login Submission
    @PostMapping("/login/{role}")
    public String doLogin(@PathVariable String role,
                          @RequestParam String email,
                          @RequestParam String password,
                          HttpSession session,
                          Model model) {
        String cleanRole = role.toLowerCase();
        switch (cleanRole) {
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
                    session.setAttribute("adminName", admin.get().getName());
                    return "redirect:/admin/dashboard";
                }
            }
        }
        model.addAttribute("role", cleanRole);
        model.addAttribute("email", email);
        model.addAttribute("error", "Invalid email or password");
        return "login";
    }

    // Register Form Display
    @GetMapping("/register/{role}")
    public String registerPage(@PathVariable String role, Model model) {
        String cleanRole = role.toLowerCase();
        model.addAttribute("role", cleanRole);
        if ("staff".equals(cleanRole)) {
            model.addAttribute("departments", authService.getAllDepartments());
        }
        return "register";
    }

    // Register Submission
    @PostMapping("/register/{role}")
    public String doRegister(@PathVariable String role,
                             @RequestParam String name,
                             @RequestParam String email,
                             @RequestParam String password,
                             @RequestParam(required = false) String confirmPassword,
                             @RequestParam(required = false) String rollNumber,
                             @RequestParam(required = false) Long departmentId,
                             Model model,
                             RedirectAttributes redirectAttributes) {
        String cleanRole = role.toLowerCase();

        // Validation
        if (confirmPassword != null && !password.equals(confirmPassword)) {
            model.addAttribute("role", cleanRole);
            model.addAttribute("name", name);
            model.addAttribute("email", email);
            model.addAttribute("rollNumber", rollNumber);
            model.addAttribute("selectedDepartmentId", departmentId);
            if ("staff".equals(cleanRole)) {
                model.addAttribute("departments", authService.getAllDepartments());
            }
            model.addAttribute("error", "Passwords do not match");
            return "register";
        }

        try {
            switch (cleanRole) {
                case "student" -> authService.registerStudent(name, email, password, rollNumber);
                case "staff" -> authService.registerStaff(name, email, password, departmentId);
                case "admin" -> authService.registerAdmin(name, email, password);
                default -> throw new IllegalArgumentException("Unknown role: " + cleanRole);
            }
            redirectAttributes.addFlashAttribute("success", "Account created successfully! Please sign in.");
            return "redirect:/login/" + cleanRole;
        } catch (IllegalArgumentException ex) {
            model.addAttribute("role", cleanRole);
            model.addAttribute("name", name);
            model.addAttribute("email", email);
            model.addAttribute("rollNumber", rollNumber);
            model.addAttribute("selectedDepartmentId", departmentId);
            if ("staff".equals(cleanRole)) {
                model.addAttribute("departments", authService.getAllDepartments());
            }
            model.addAttribute("error", ex.getMessage());
            return "register";
        }
    }

    // Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }
}
