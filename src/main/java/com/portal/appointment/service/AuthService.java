package com.portal.appointment.service;

import com.portal.appointment.entity.Admin;
import com.portal.appointment.entity.Department;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.entity.Student;
import com.portal.appointment.repository.AdminRepository;
import com.portal.appointment.repository.DepartmentRepository;
import com.portal.appointment.repository.StaffRepository;
import com.portal.appointment.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public Optional<Student> loginStudent(String email, String password) {
        return studentRepository.findByEmailAndPassword(email, password);
    }

    public Optional<Staff> loginStaff(String email, String password) {
        return staffRepository.findByEmailAndPassword(email, password);
    }

    public Optional<Admin> loginAdmin(String email, String password) {
        return adminRepository.findByEmailAndPassword(email, password);
    }

    // Student Registration
    public Student registerStudent(String name, String email, String password, String rollNumber) {
        if (studentRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered as a student");
        }
        Student student = new Student(name.trim(), email.trim().toLowerCase(), password, rollNumber != null ? rollNumber.trim() : "");
        return studentRepository.save(student);
    }

    // Staff / Faculty Registration
    public Staff registerStaff(String name, String email, String password, Long departmentId) {
        if (staffRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered as staff/faculty");
        }
        Department department = null;
        if (departmentId != null) {
            department = departmentRepository.findById(departmentId).orElse(null);
        }
        Staff staff = new Staff(name.trim(), email.trim().toLowerCase(), password, department);
        return staffRepository.save(staff);
    }

    // Admin Registration
    public Admin registerAdmin(String name, String email, String password) {
        if (adminRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email is already registered as admin");
        }
        Admin admin = new Admin(name.trim(), email.trim().toLowerCase(), password);
        return adminRepository.save(admin);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
}
