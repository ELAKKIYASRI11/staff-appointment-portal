package com.portal.appointment.config;

import com.portal.appointment.entity.*;
import com.portal.appointment.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Override
    public void run(String... args) {
        // Seed departments if empty
        if (departmentRepository.count() == 0) {
            log.info("Seeding initial departments...");
            departmentRepository.saveAll(List.of(
                    new Department("Computer Science"),
                    new Department("Mathematics"),
                    new Department("Physics"),
                    new Department("Electronics"),
                    new Department("Mechanical")
            ));
        }

        // Seed admin if empty
        if (adminRepository.count() == 0) {
            log.info("Seeding default admin...");
            adminRepository.save(new Admin("System Admin", "admin@college.edu", "admin123"));
        }

        // Seed staff if empty
        if (staffRepository.count() == 0) {
            log.info("Seeding initial staff...");
            List<Department> deps = departmentRepository.findAll();
            Department cs = deps.stream().filter(d -> d.getName().equals("Computer Science")).findFirst().orElse(deps.get(0));
            Department math = deps.stream().filter(d -> d.getName().equals("Mathematics")).findFirst().orElse(deps.get(0));
            Department phys = deps.stream().filter(d -> d.getName().equals("Physics")).findFirst().orElse(deps.get(0));
            Department elec = deps.stream().filter(d -> d.getName().equals("Electronics")).findFirst().orElse(deps.get(0));
            Department mech = deps.stream().filter(d -> d.getName().equals("Mechanical")).findFirst().orElse(deps.get(0));

            Staff s1 = new Staff("Dr. Sarah Johnson", "sarah.johnson@college.edu", "staff123", cs);
            s1.setAvgRating(4.8);
            s1.setTotalRatings(12);

            Staff s2 = new Staff("Prof. James Miller", "james.miller@college.edu", "staff123", math);
            s2.setAvgRating(4.5);
            s2.setTotalRatings(35);

            Staff s3 = new Staff("Dr. Emma Wilson", "emma.wilson@college.edu", "staff123", phys);
            s3.setAvgRating(4.9);
            s3.setTotalRatings(18);

            Staff s4 = new Staff("Dr. Raj Patel", "raj.patel@college.edu", "staff123", elec);
            s4.setAvgRating(4.2);
            s4.setTotalRatings(9);

            Staff s5 = new Staff("Prof. Meera Iyer", "meera.iyer@college.edu", "staff123", mech);
            s5.setAvgRating(4.7);
            s5.setTotalRatings(21);

            staffRepository.saveAll(List.of(s1, s2, s3, s4, s5));

            // Seed availability for staff
            availabilityRepository.saveAll(List.of(
                    new Availability(s1, "MONDAY", "14:00"),
                    new Availability(s1, "WEDNESDAY", "15:00"),
                    new Availability(s2, "TUESDAY", "10:00"),
                    new Availability(s3, "THURSDAY", "13:00"),
                    new Availability(s4, "FRIDAY", "11:00"),
                    new Availability(s5, "MONDAY", "16:00")
            ));
        }

        // Seed students if empty
        if (studentRepository.count() == 0) {
            log.info("Seeding initial students...");
            studentRepository.saveAll(List.of(
                    new Student("John Smith", "john.smith@college.edu", "student123", "CS101"),
                    new Student("Alice Brown", "alice.brown@college.edu", "student123", "CS102"),
                    new Student("Bob Davis", "bob.davis@college.edu", "student123", "CS103"),
                    new Student("Elakkiyasri", "elakkiyasri@college.edu", "student123", "CS104"),
                    new Student("Priya Sharma", "priya.sharma@college.edu", "student123", "CS105"),
                    new Student("Karthik Rajan", "karthik.rajan@college.edu", "student123", "CS106"),
                    new Student("Divya Menon", "divya.menon@college.edu", "student123", "CS107"),
                    new Student("Arjun Kumar", "arjun.kumar@college.edu", "student123", "CS108"),
                    new Student("Sneha Reddy", "sneha.reddy@college.edu", "student123", "CS109"),
                    new Student("Vikram Singh", "vikram.singh@college.edu", "student123", "CS110")
            ));
        }
        log.info("Database initialization completed successfully.");
    }
}
