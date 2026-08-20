-- ============================================================
-- Run this in SQL Workbench AFTER starting the Spring Boot app
-- at least once (so Hibernate has auto-created the tables).
-- Database: appointment_portal
-- ============================================================

USE appointment_portal;

-- ---- Departments ----
INSERT INTO department (name) VALUES
('Computer Science'), ('Mathematics'), ('Physics'), ('Electronics'), ('Mechanical');

-- ---- Admin (1) ----
-- login: admin@college.edu / admin123
INSERT INTO admin (name, email, password) VALUES
('System Admin', 'admin@college.edu', 'admin123');

-- ---- Staff (5) ----
-- all staff passwords: staff123
INSERT INTO staff (name, email, password, department_id, avg_rating, total_ratings) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@college.edu', 'staff123', 1, 0.0, 0),
('Prof. James Miller', 'james.miller@college.edu', 'staff123', 2, 0.0, 0),
('Dr. Emma Wilson', 'emma.wilson@college.edu', 'staff123', 3, 0.0, 0),
('Dr. Raj Patel', 'raj.patel@college.edu', 'staff123', 4, 0.0, 0),
('Prof. Meera Iyer', 'meera.iyer@college.edu', 'staff123', 5, 0.0, 0);

-- ---- Students (10) ----
-- all student passwords: student123
INSERT INTO student (name, email, password, roll_number) VALUES
('John Smith', 'john.smith@college.edu', 'student123', 'CS101'),
('Alice Brown', 'alice.brown@college.edu', 'student123', 'CS102'),
('Bob Davis', 'bob.davis@college.edu', 'student123', 'CS103'),
('Elakkiyasri', 'elakkiyasri@college.edu', 'student123', 'CS104'),
('Priya Sharma', 'priya.sharma@college.edu', 'student123', 'CS105'),
('Karthik Rajan', 'karthik.rajan@college.edu', 'student123', 'CS106'),
('Divya Menon', 'divya.menon@college.edu', 'student123', 'CS107'),
('Arjun Kumar', 'arjun.kumar@college.edu', 'student123', 'CS108'),
('Sneha Reddy', 'sneha.reddy@college.edu', 'student123', 'CS109'),
('Vikram Singh', 'vikram.singh@college.edu', 'student123', 'CS110');

-- ---- Sample Availability slots ----
INSERT INTO availability (staff_id, day_of_week, time_slot, booked) VALUES
(1, 'MONDAY', '14:00', false),
(1, 'WEDNESDAY', '15:00', false),
(2, 'TUESDAY', '10:00', false),
(3, 'THURSDAY', '13:00', false),
(4, 'FRIDAY', '11:00', false),
(5, 'MONDAY', '16:00', false);
