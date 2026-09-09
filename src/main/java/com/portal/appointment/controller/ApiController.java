package com.portal.appointment.controller;

import com.portal.appointment.entity.*;
import com.portal.appointment.repository.*;
import com.portal.appointment.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:8080", "http://127.0.0.1:5173"}, allowCredentials = "true")
public class ApiController {

    @Autowired
    private AuthService authService;

    @Autowired
    private StaffService staffService;

    @Autowired
    private AvailabilityService availabilityService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpSession session) {
        String email = body.get("email");
        String password = body.get("password");
        String role = body.getOrDefault("role", "student").toLowerCase();

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        switch (role) {
            case "student" -> {
                Optional<Student> student = authService.loginStudent(email, password);
                if (student.isPresent()) {
                    Student s = student.get();
                    session.setAttribute("studentId", s.getId());
                    session.setAttribute("studentName", s.getName());
                    session.setAttribute("role", "student");
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "role", "student",
                            "user", Map.of("id", s.getId(), "name", s.getName(), "email", s.getEmail(), "rollNumber", s.getRollNumber() != null ? s.getRollNumber() : "")
                    ));
                }
            }
            case "staff" -> {
                Optional<Staff> staff = authService.loginStaff(email, password);
                if (staff.isPresent()) {
                    Staff st = staff.get();
                    session.setAttribute("staffId", st.getId());
                    session.setAttribute("staffName", st.getName());
                    session.setAttribute("role", "staff");
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "role", "staff",
                            "user", Map.of(
                                    "id", st.getId(),
                                    "name", st.getName(),
                                    "email", st.getEmail(),
                                    "department", st.getDepartment() != null ? st.getDepartment().getName() : "General",
                                    "avgRating", st.getAvgRating() != null ? st.getAvgRating() : 0.0,
                                    "totalRatings", st.getTotalRatings() != null ? st.getTotalRatings() : 0
                            )
                    ));
                }
            }
            case "admin" -> {
                Optional<Admin> admin = authService.loginAdmin(email, password);
                if (admin.isPresent()) {
                    Admin a = admin.get();
                    session.setAttribute("adminId", a.getId());
                    session.setAttribute("adminName", a.getName());
                    session.setAttribute("role", "admin");
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "role", "admin",
                            "user", Map.of("id", a.getId(), "name", a.getName(), "email", a.getEmail())
                    ));
                }
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String role = String.valueOf(body.getOrDefault("role", "student")).toLowerCase();
        String name = String.valueOf(body.get("name"));
        String email = String.valueOf(body.get("email"));
        String password = String.valueOf(body.get("password"));

        if (name == null || email == null || password == null || name.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "All fields are required"));
        }

        try {
            switch (role) {
                case "student" -> {
                    String rollNumber = body.get("rollNumber") != null ? String.valueOf(body.get("rollNumber")) : "";
                    Student s = authService.registerStudent(name, email, password, rollNumber);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Student registered successfully",
                            "user", Map.of("id", s.getId(), "name", s.getName(), "email", s.getEmail(), "role", "student")
                    ));
                }
                case "staff" -> {
                    Long departmentId = null;
                    if (body.get("departmentId") != null && !String.valueOf(body.get("departmentId")).isBlank()) {
                        departmentId = Long.parseLong(String.valueOf(body.get("departmentId")));
                    }
                    Staff st = authService.registerStaff(name, email, password, departmentId);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Staff/Faculty registered successfully",
                            "user", Map.of("id", st.getId(), "name", st.getName(), "email", st.getEmail(), "role", "staff")
                    ));
                }
                case "admin" -> {
                    Admin a = authService.registerAdmin(name, email, password);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "message", "Admin registered successfully",
                            "user", Map.of("id", a.getId(), "name", a.getName(), "email", a.getEmail(), "role", "admin")
                    ));
                }
                default -> {
                    return ResponseEntity.badRequest().body(Map.of("error", "Invalid role specified"));
                }
            }
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @GetMapping("/auth/me")
    public ResponseEntity<?> me(HttpSession session) {
        String role = (String) session.getAttribute("role");
        if (role == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        Map<String, Object> res = new HashMap<>();
        res.put("authenticated", true);
        res.put("role", role);

        if ("student".equals(role)) {
            Long id = (Long) session.getAttribute("studentId");
            studentRepository.findById(id).ifPresent(s -> res.put("user", Map.of("id", s.getId(), "name", s.getName(), "email", s.getEmail(), "rollNumber", s.getRollNumber() != null ? s.getRollNumber() : "")));
        } else if ("staff".equals(role)) {
            Long id = (Long) session.getAttribute("staffId");
            staffRepository.findById(id).ifPresent(st -> res.put("user", Map.of("id", st.getId(), "name", st.getName(), "email", st.getEmail(), "department", st.getDepartment() != null ? st.getDepartment().getName() : "")));
        } else if ("admin".equals(role)) {
            Long id = (Long) session.getAttribute("adminId");
            adminRepository.findById(id).ifPresent(a -> res.put("user", Map.of("id", a.getId(), "name", a.getName(), "email", a.getEmail())));
        }
        return ResponseEntity.ok(res);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("success", true));
    }

    // ==========================================
    // DEPARTMENTS
    // ==========================================

    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }

    // ==========================================
    // FACULTY & SLOTS
    // ==========================================

    @GetMapping("/staff")
    public ResponseEntity<?> getStaffList(@RequestParam(required = false) String q) {
        List<Staff> staffList = staffService.search(q);
        List<Map<String, Object>> result = staffList.stream().map(st -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", st.getId());
            map.put("name", st.getName());
            map.put("email", st.getEmail());
            map.put("department", st.getDepartment() != null ? Map.of("id", st.getDepartment().getId(), "name", st.getDepartment().getName()) : null);
            map.put("avgRating", st.getAvgRating() != null ? st.getAvgRating() : 0.0);
            map.put("totalRatings", st.getTotalRatings() != null ? st.getTotalRatings() : 0);

            List<Availability> openSlots = availabilityService.getOpenSlotsForStaff(st);
            map.put("openSlots", openSlots.stream().map(slot -> Map.of(
                    "id", slot.getId(),
                    "dayOfWeek", slot.getDayOfWeek(),
                    "timeSlot", slot.getTimeSlot(),
                    "booked", slot.isBooked()
            )).collect(Collectors.toList()));
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/staff/{id}/slots")
    public ResponseEntity<?> getStaffSlots(@PathVariable Long id) {
        Staff staff = staffService.getById(id);
        return ResponseEntity.ok(availabilityService.getOpenSlotsForStaff(staff));
    }

    @GetMapping("/staff/my-slots")
    public ResponseEntity<?> getMySlots(HttpSession session, @RequestParam(required = false) Long staffId) {
        Staff staff = null;
        Long id = staffId != null ? staffId : (Long) session.getAttribute("staffId");
        if (id != null) {
            staff = staffRepository.findById(id).orElse(null);
        }
        if (staff == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Staff authentication required"));
        }
        return ResponseEntity.ok(availabilityService.getForStaff(staff));
    }

    @PostMapping("/staff/slots")
    public ResponseEntity<?> addSlot(@RequestBody Map<String, String> body, HttpSession session) {
        Long staffId = body.get("staffId") != null ? Long.parseLong(body.get("staffId")) : (Long) session.getAttribute("staffId");
        if (staffId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Staff authentication required"));
        }
        Staff staff = staffRepository.findById(staffId).orElse(null);
        if (staff == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff member not found"));
        }
        String dayOfWeek = body.get("dayOfWeek");
        String timeSlot = body.get("timeSlot");
        if (dayOfWeek == null || timeSlot == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "dayOfWeek and timeSlot are required"));
        }
        Availability slot = availabilityService.addSlot(staff, dayOfWeek.toUpperCase(), timeSlot);
        return ResponseEntity.ok(Map.of("success", true, "slot", slot));
    }

    // ==========================================
    // APPOINTMENTS
    // ==========================================

    @PostMapping("/appointments/book")
    public ResponseEntity<?> bookAppointment(@RequestBody Map<String, Object> body, HttpSession session) {
        Long studentId = body.get("studentId") != null ? Long.parseLong(String.valueOf(body.get("studentId"))) : (Long) session.getAttribute("studentId");
        if (studentId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Student authentication required"));
        }
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
        }

        Long staffId = Long.parseLong(String.valueOf(body.get("staffId")));
        Long availabilityId = Long.parseLong(String.valueOf(body.get("availabilityId")));
        String purpose = String.valueOf(body.get("purpose"));

        Staff staff = staffService.getById(staffId);
        Availability availability = availabilityService.getById(availabilityId);

        if (availability.isBooked()) {
            return ResponseEntity.badRequest().body(Map.of("error", "This slot has already been booked"));
        }

        Appointment appt = appointmentService.book(student, staff, availability, purpose);
        return ResponseEntity.ok(Map.of("success", true, "appointmentId", appt.getId()));
    }

    @GetMapping("/appointments/student")
    public ResponseEntity<?> getStudentAppointments(HttpSession session, @RequestParam(required = false) Long studentId) {
        Long id = studentId != null ? studentId : (Long) session.getAttribute("studentId");
        if (id == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Student authentication required"));
        }
        Student student = studentRepository.findById(id).orElse(null);
        if (student == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Student not found"));
        }

        List<Appointment> list = appointmentService.getForStudent(student);
        List<Map<String, Object>> mapped = list.stream().map(this::formatAppointment).collect(Collectors.toList());
        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/appointments/staff")
    public ResponseEntity<?> getStaffAppointments(HttpSession session, @RequestParam(required = false) Long staffId) {
        Long id = staffId != null ? staffId : (Long) session.getAttribute("staffId");
        if (id == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Staff authentication required"));
        }
        Staff staff = staffRepository.findById(id).orElse(null);
        if (staff == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
        }

        List<Appointment> list = appointmentService.getForStaff(staff);
        List<Map<String, Object>> mapped = list.stream().map(this::formatAppointment).collect(Collectors.toList());
        return ResponseEntity.ok(mapped);
    }

    @PostMapping("/appointments/{id}/accept")
    public ResponseEntity<?> acceptAppointment(@PathVariable Long id) {
        Appointment appt = appointmentService.getById(id);
        appointmentService.accept(appt);
        return ResponseEntity.ok(Map.of("success", true, "status", appt.getStatus()));
    }

    @PostMapping("/appointments/{id}/decline")
    public ResponseEntity<?> declineAppointment(@PathVariable Long id) {
        Appointment appt = appointmentService.getById(id);
        appointmentService.decline(appt);
        return ResponseEntity.ok(Map.of("success", true, "status", appt.getStatus()));
    }

    @PostMapping("/appointments/{id}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        Appointment appt = appointmentService.getById(id);
        String remarks = body != null ? body.get("remarks") : null;
        appointmentService.complete(appt, remarks);
        return ResponseEntity.ok(Map.of("success", true, "status", appt.getStatus()));
    }

    @PostMapping("/appointments/{id}/rate")
    public ResponseEntity<?> rateAppointment(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Appointment appt = appointmentService.getById(id);
        Integer rating = body.get("rating");
        if (rating == null || rating < 1 || rating > 5) {
            return ResponseEntity.badRequest().body(Map.of("error", "Rating must be between 1 and 5"));
        }
        appointmentService.rateAppointment(appt, rating);
        return ResponseEntity.ok(Map.of("success", true, "rating", rating));
    }

    // ==========================================
    // ADMIN DASHBOARD
    // ==========================================

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminStats() {
        List<Appointment> all = appointmentService.getAll();
        long totalAppointments = all.size();
        double avgRating = all.stream()
                .filter(a -> a.getRating() != null)
                .mapToInt(Appointment::getRating)
                .average()
                .orElse(0.0);

        List<Staff> staffList = staffService.getAllStaff();
        Map<Long, Long> countsByStaff = all.stream()
                .filter(a -> a.getStaff() != null && a.getStaff().getId() != null)
                .collect(Collectors.groupingBy(a -> a.getStaff().getId(), Collectors.counting()));

        List<Map<String, Object>> staffOverview = staffList.stream().map(st -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", st.getId());
            map.put("name", st.getName());
            map.put("email", st.getEmail());
            map.put("department", st.getDepartment() != null ? st.getDepartment().getName() : "General");
            map.put("avgRating", st.getAvgRating() != null ? st.getAvgRating() : 0.0);
            map.put("totalRatings", st.getTotalRatings() != null ? st.getTotalRatings() : 0);
            map.put("appointmentCount", countsByStaff.getOrDefault(st.getId(), 0L));
            return map;
        }).collect(Collectors.toList());

        List<Map<String, Object>> flaggedList = appointmentService.getFlagged().stream()
                .map(this::formatAppointment).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of(
                "totalAppointments", totalAppointments,
                "avgRating", Math.round(avgRating * 10.0) / 10.0,
                "totalStaff", staffList.size(),
                "totalStudents", studentRepository.count(),
                "staffOverview", staffOverview,
                "flaggedAppointments", flaggedList
        ));
    }

    @PostMapping("/admin/check-overdue")
    public ResponseEntity<?> checkOverdue() {
        int newlyFlagged = appointmentService.flagOverdueAppointments();
        return ResponseEntity.ok(Map.of("success", true, "flaggedCount", newlyFlagged));
    }

    @PostMapping("/admin/flagged/{id}/resolve")
    public ResponseEntity<?> resolveFlag(@PathVariable Long id) {
        Appointment appt = appointmentService.getById(id);
        appointmentService.clearFlag(appt);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private Map<String, Object> formatAppointment(Appointment appt) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", appt.getId());
        m.put("purpose", appt.getPurpose());
        m.put("status", appt.getStatus().name());
        m.put("createdAt", appt.getCreatedAt() != null ? appt.getCreatedAt().toString() : null);
        m.put("respondedAt", appt.getRespondedAt() != null ? appt.getRespondedAt().toString() : null);
        m.put("remarks", appt.getRemarks());
        m.put("rating", appt.getRating());
        m.put("flagged", appt.isFlagged());

        if (appt.getStudent() != null) {
            m.put("student", Map.of(
                    "id", appt.getStudent().getId(),
                    "name", appt.getStudent().getName(),
                    "email", appt.getStudent().getEmail(),
                    "rollNumber", appt.getStudent().getRollNumber() != null ? appt.getStudent().getRollNumber() : ""
            ));
        }
        if (appt.getStaff() != null) {
            m.put("staff", Map.of(
                    "id", appt.getStaff().getId(),
                    "name", appt.getStaff().getName(),
                    "email", appt.getStaff().getEmail(),
                    "department", appt.getStaff().getDepartment() != null ? appt.getStaff().getDepartment().getName() : ""
            ));
        }
        if (appt.getAvailability() != null) {
            m.put("availability", Map.of(
                    "id", appt.getAvailability().getId(),
                    "dayOfWeek", appt.getAvailability().getDayOfWeek(),
                    "timeSlot", appt.getAvailability().getTimeSlot()
            ));
        }
        return m;
    }
}
