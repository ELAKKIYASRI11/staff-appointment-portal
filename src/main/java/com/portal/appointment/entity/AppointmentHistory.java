package com.portal.appointment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_history")
@Getter
@Setter
@NoArgsConstructor
public class AppointmentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    // e.g. "CREATED", "ACCEPTED", "REJECTED", "COMPLETED", "FLAGGED"
    @Column(nullable = false)
    private String action;

    @Column(name = "performed_by", nullable = false)
    private String performedBy;

    @Column(nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();

    public AppointmentHistory(Appointment appointment, String action, String performedBy) {
        this.appointment = appointment;
        this.action = action;
        this.performedBy = performedBy;
    }
}
