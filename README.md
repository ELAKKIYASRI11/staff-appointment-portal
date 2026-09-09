# Staff Appointment Booking Portal

**Java + Spring Boot 3 + Thymeleaf + MySQL (Workbench)**

A full-featured appointment scheduling system for higher education institutions, connecting students, staff/faculty, and administrators.

---

## 👥 Roles & Capabilities

### 1. Student
- **Register / Sign In**: Register with Name, Email, Password, and Roll Number (`/register/student`).
- **Browse Faculty & Search**: View faculty with department and live rating (`/student/dashboard`).
- **Live Search (`?q=<term>`)**: Filter staff by faculty name or department (case-insensitive partial match).
- **Book Appointments**: Select from open availability slots, enter meeting purpose, and book.
- **My Appointments**: Track pending, accepted, rejected, and completed sessions.
- **Rate Completed Sessions**: Rate 1–5 stars upon completion to update faculty average rating.

### 2. Staff / Faculty
- **Register / Sign In**: Register with Name, Email, Password, and select Department (`/register/staff`).
- **Appointment Requests**: View upcoming requests with student details and color-coded status badges.
- **Accept / Decline**: Accept appointments or decline them (declining immediately frees up the slot for other students).
- **Complete with Remarks**: Mark sessions complete and add optional feedback/notes.
- **Manage Availability Slots**: Add availability slots (day of week + time slot).

### 3. Administrator
- **Sign In**: Login as admin (`/login/admin`).
- **System Overview**: Live metrics for total appointments and overall portal average rating.
- **Faculty Breakdown**: Per-faculty appointment volume and average rating badges.
- **48-Hour Escalation System**:
  - Automatically flags pending appointments older than 48 hours for review.
  - Includes a manual **"Check now"** button on the admin dashboard.
  - Admin can review and resolve flagged items.
  - Automated background hourly scan via `@EnableScheduling` and `@Scheduled`.

---

## 🛠️ Database Setup (MySQL / SQL Workbench)

1. Ensure MySQL Server is running on `localhost:3306`.
2. Configure `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/appointment_portal?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
spring.datasource.password=your_password_here
```
3. The database `appointment_portal` and all tables are auto-created by Hibernate on startup (`spring.jpa.hibernate.ddl-auto=update`).
4. **Seed Data**:
   - `seed-data.sql` is provided in the project root.
   - You can also execute `seed-data.sql` inside MySQL Workbench anytime to reset/refresh sample data.
   - The application also includes an automated seeder (`DataInitializer`) that pre-populates initial departments, admin, faculty, students, and slots if the database is empty.

---

## 🚀 How to Run the App

Open terminal in the project directory:

```bash
# Using Maven Wrapper (No separate Maven installation needed):
.\mvnw.cmd spring-boot:run

# Or with global Maven if installed:
mvn spring-boot:run
```

Then open your browser at:
👉 **[http://localhost:8080](http://localhost:8080)**

---

## 🔑 Test Logins (from `seed-data.sql`)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@college.edu` | `admin123` |
| **Staff / Faculty** | `sarah.johnson@college.edu` | `staff123` |
| **Student** | `john.smith@college.edu` | `student123` |

*(Additional students such as `elakkiyasri@college.edu` / `student123` are also pre-seeded).*

---

## 📁 Project Structure

```
src/main/java/com/portal/appointment/
├── AppointmentPortalApplication.java   # Main entry point with @EnableScheduling
├── config/
│   └── DataInitializer.java            # Automatic database seeder for initial run
├── controller/
│   ├── HomeController.java             # Role selection, login, registration, logout
│   ├── StudentController.java          # Student dashboard, faculty search, booking, rating
│   ├── StaffController.java            # Faculty requests, accept/decline/complete, availability
│   └── AdminController.java            # Analytics, faculty breakdown, 48hr escalation checks
├── entity/
│   ├── Admin.java
│   ├── Appointment.java
│   ├── AppointmentHistory.java
│   ├── AppointmentStatus.java
│   ├── Availability.java
│   ├── Department.java
│   ├── Staff.java
│   └── Student.java
├── repository/                         # Spring Data JPA repositories (includes search query)
└── service/
    ├── AuthService.java                # Multi-role authentication & registration
    ├── AppointmentService.java         # Booking, workflow, ratings, 48hr escalation logic
    ├── AvailabilityService.java        # Faculty slot management
    └── StaffService.java               # Search & rating calculation logic

src/main/resources/
├── application.properties              # MySQL DataSource and JPA configuration
├── static/css/style.css                # Responsive, modern UI stylesheet
└── templates/
    ├── index.html                      # Landing page with Login and Register buttons
    ├── login.html                      # Sign-in page with feedback alerts & register link
    ├── register.html                   # Role-tailored registration page
    ├── student/
    │   ├── dashboard.html              # Browse faculty, live search, slot booking
    │   └── appointments.html           # My appointments list, status badges, star rating
    ├── staff/
    │   ├── dashboard.html              # Appointment requests, accept/decline/complete
    │   └── availability.html           # Manage availability slots
    └── admin/
        └── dashboard.html              # Stats, faculty performance, flagged escalations
```
