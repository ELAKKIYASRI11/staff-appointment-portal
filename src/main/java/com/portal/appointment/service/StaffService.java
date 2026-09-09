package com.portal.appointment.service;

import com.portal.appointment.entity.Staff;
import com.portal.appointment.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Staff getById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + id));
    }

    /**
     * Search feature: filters staff by name OR department name, case-insensitive.
     * Empty or blank query returns all staff.
     */
    public List<Staff> search(String query) {
        if (query == null || query.isBlank()) {
            return staffRepository.findAll();
        }
        return staffRepository
                .findByNameContainingIgnoreCaseOrDepartment_NameContainingIgnoreCase(query.trim(), query.trim());
    }

    public void updateRating(Staff staff, int newRating) {
        double currentAvg = staff.getAvgRating() != null ? staff.getAvgRating() : 0.0;
        int currentTotal = staff.getTotalRatings() != null ? staff.getTotalRatings() : 0;

        double totalScore = currentAvg * currentTotal;
        int newTotal = currentTotal + 1;
        double newAvg = (totalScore + newRating) / newTotal;

        staff.setTotalRatings(newTotal);
        staff.setAvgRating(Math.round(newAvg * 10.0) / 10.0);
        staffRepository.save(staff);
    }
}
