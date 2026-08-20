package com.portal.appointment.service;

import com.portal.appointment.entity.Availability;
import com.portal.appointment.entity.Staff;
import com.portal.appointment.repository.AvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public List<Availability> getForStaff(Staff staff) {
        return availabilityRepository.findByStaff(staff);
    }

    public List<Availability> getOpenSlotsForStaff(Staff staff) {
        return availabilityRepository.findByStaffAndBookedFalse(staff);
    }

    public Availability addSlot(Staff staff, String dayOfWeek, String timeSlot) {
        Availability availability = new Availability();
        availability.setStaff(staff);
        availability.setDayOfWeek(dayOfWeek);
        availability.setTimeSlot(timeSlot);
        return availabilityRepository.save(availability);
    }

    public Availability getById(Long id) {
        return availabilityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found: " + id));
    }

    public void markBooked(Availability availability) {
        availability.setBooked(true);
        availabilityRepository.save(availability);
    }

    public void release(Availability availability) {
        availability.setBooked(false);
        availabilityRepository.save(availability);
    }
}
