package com.portal.appointment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "availability")
@Getter
@Setter
@NoArgsConstructor
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

    // e.g. "14:00" - stored as a simple string slot start time for the scoped MVP
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;

    // once a student books this slot, it's no longer offered to others
    @Column(nullable = false)
    private boolean booked = false;
}
