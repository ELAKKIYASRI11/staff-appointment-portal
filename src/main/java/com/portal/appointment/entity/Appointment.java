package com.portal.appointment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment")
@Getter
@Setter
@NoArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @ManyToOne
    @JoinColumn(name = "availability_id")
    private Availability availability;

    @Column(nullable = false)
    private String purpose;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // when staff last accepted/rejected/completed - used to compute the 48hr escalation window
    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    // staff's remarks after marking complete
    private String remarks;

    // student's rating (1-5) given after completion
    private Integer rating;

    // true once flagged for admin review (pending too long)
    @Column(nullable = false)
    private boolean flagged = false;
}
