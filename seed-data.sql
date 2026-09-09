-- ============================================================
-- Run this in SQL Workbench AFTER starting the Spring Boot app
-- at least once (so Hibernate has auto-created the tables).
-- Database: appointment_portal
-- ============================================================

CREATE DATABASE IF NOT EXISTS appointment_portal;
USE appointment_portal;

-- ---- Departments ----
INSERT INTO department (id, name) VALUES
(1, 'Computer Science'),
(2, 'Mathematics'),
(3, 'Physics'),
(4, 'Electronics'),
(5, 'Mechanical')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---- Admin (1) ----
-- login: admin@college.edu / admin123
INSERT INTO admin (id, name, email, password) VALUES
(1, 'System Admin', 'admin@college.edu', 'admin123')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---- Staff (5) ----
-- all staff passwords: staff123
INSERT INTO staff (id, name, email, password, department_id, avg_rating, total_ratings) VALUES
(1, 'Dr. Sarah Johnson', 'sarah.johnson@college.edu', 'staff123', 1, 4.8, 12),
(2, 'Prof. James Miller', 'james.miller@college.edu', 'staff123', 2, 4.5, 35),
(3, 'Dr. Emma Wilson', 'emma.wilson@college.edu', 'staff123', 3, 4.9, 18),
(4, 'Dr. Raj Patel', 'raj.patel@college.edu', 'staff123', 4, 4.2, 9),
(5, 'Prof. Meera Iyer', 'meera.iyer@college.edu', 'staff123', 5, 4.7, 21)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---- Students (10) ----
-- all student passwords: student123
INSERT INTO student (id, name, email, password, roll_number) VALUES
(1, 'John Smith', 'john.smith@college.edu', 'student123', 'CS101'),
(2, 'Alice Brown', 'alice.brown@college.edu', 'student123', 'CS102'),
(3, 'Bob Davis', 'bob.davis@college.edu', 'student123', 'CS103'),
(4, 'Elakkiyasri', 'elakkiyasri@college.edu', 'student123', 'CS104'),
(5, 'Priya Sharma', 'priya.sharma@college.edu', 'student123', 'CS105'),
(6, 'Karthik Rajan', 'karthik.rajan@college.edu', 'student123', 'CS106'),
(7, 'Divya Menon', 'divya.menon@college.edu', 'student123', 'CS107'),
(8, 'Arjun Kumar', 'arjun.kumar@college.edu', 'student123', 'CS108'),
(9, 'Sneha Reddy', 'sneha.reddy@college.edu', 'student123', 'CS109'),
(10, 'Vikram Singh', 'vikram.singh@college.edu', 'student123', 'CS110')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- ---- Sample Availability slots ----
INSERT INTO availability (id, staff_id, day_of_week, time_slot, booked) VALUES
(1, 1, 'MONDAY', '14:00', false),
(2, 1, 'WEDNESDAY', '15:00', false),
(3, 2, 'TUESDAY', '10:00', false),
(4, 3, 'THURSDAY', '13:00', false),
(5, 4, 'FRIDAY', '11:00', false),
(6, 5, 'MONDAY', '16:00', false)
ON DUPLICATE KEY UPDATE booked=VALUES(booked);
