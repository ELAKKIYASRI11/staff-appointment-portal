package com.portal.appointment.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "availability")
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    // e.g. MONDAY, TUESDAY ...
    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;

    // e.g. "14:00"
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    // once a student books this slot, it's no longer offered to others
    @Column(nullable = false)
    private boolean booked = false;

    public Availability() {
    }

    public Availability(Staff staff, String dayOfWeek, String timeSlot) {
        this.staff = staff;
        this.dayOfWeek = dayOfWeek;
        this.timeSlot = timeSlot;
        this.booked = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public boolean isBooked() {
        return booked;
    }

    public void setBooked(boolean booked) {
        this.booked = booked;
    }
}
