# Staff Appointment Booking Portal

Java + Spring Boot (Thymeleaf) + MySQL (SQL Workbench)

## Roles
- **Student** — search/browse staff, book appointments, rate completed ones
- **Staff/Faculty** — accept/decline/complete requests, manage availability slots
- **Admin** — system stats, per-staff breakdown, flagged (overdue) appointments

## 1. Database setup (SQL Workbench)
1. Open SQL Workbench, connect to your local MySQL server.
2. You don't need to manually create tables — Hibernate does it automatically
   on first run (`spring.jpa.hibernate.ddl-auto=update` in `application.properties`).
   Just make sure a connection to `localhost:3306` works with your MySQL username/password.
3. Update `src/main/resources/application.properties`:
   ```
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```
4. Run the app once (see below) — Spring Boot will auto-create the
   `appointment_portal` database and all tables.
5. In SQL Workbench, open `seed-data.sql` (in the project root) and run it
   against the `appointment_portal` database to load sample staff/students/admin
   for testing.

## 2. Run the app
```bash
mvn spring-boot:run
```
Then open **http://localhost:8080**

## 3. Test logins (from seed-data.sql)
| Role    | Email                          | Password  |
|---------|---------------------------------|-----------|
| Admin   | admin@college.edu               | admin123  |
| Staff   | sarah.johnson@college.edu       | staff123  |
| Student | john.smith@college.edu          | student123|

## Project layout
```
entity/       -> Student, Staff, Admin, Department, Availability, Appointment, AppointmentHistory
repository/   -> Spring Data JPA interfaces (includes the staff search query)
service/      -> business logic (booking, accept/decline/complete, 48hr escalation, ratings)
controller/   -> HomeController (login), StudentController, StaffController, AdminController
templates/    -> Thymeleaf HTML pages matching your screenshots
```

## Notes on the escalation feature
Pending appointments older than 48 hours get flagged (not auto-penalized) for
admin review. Right now this runs when the admin clicks **"Check now"** on the
dashboard. If you want it fully automatic later, add `@EnableScheduling` and a
`@Scheduled` job that calls `appointmentService.flagOverdueAppointments()` every
hour — happy to wire that in when you're ready.

## Student search feature (new)
The `/student/dashboard?q=<term>` endpoint filters staff by name **or**
department, case-insensitive. The search box on the Browse Faculty tab
submits to this same route.
