package com.portal.appointment.service;

import com.portal.appointment.entity.Admin;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.entity.Student;
import com.portal.appointment.repository.AdminRepository;
import com.portal.appointment.repository.StaffRepository;
import com.portal.appointment.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Optional<Student> loginStudent(String email, String password) {
        return studentRepository.findByEmailAndPassword(email, password);
    }

    public Optional<Staff> loginStaff(String email, String password) {
        return staffRepository.findByEmailAndPassword(email, password);
    }

    public Optional<Admin> loginAdmin(String email, String password) {
        return adminRepository.findByEmailAndPassword(email, password);
    }

    public Student registerStudent(Student student) {
        return studentRepository.save(student);
    }
}
