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
     * The search feature: students type a query and it matches against
     * staff name OR department name (case-insensitive, partial match).
     * Empty/blank query returns everyone, so the same endpoint can back
     * both "browse all" and "search".
     */
    public List<Staff> search(String query) {
        if (query == null || query.isBlank()) {
            return staffRepository.findAll();
        }
        return staffRepository
                .findByNameContainingIgnoreCaseOrDepartment_NameContainingIgnoreCase(query, query);
    }

    public void updateRating(Staff staff, int newRating) {
        double totalScore = staff.getAvgRating() * staff.getTotalRatings();
        int newTotal = staff.getTotalRatings() + 1;
        double newAvg = (totalScore + newRating) / newTotal;
        staff.setTotalRatings(newTotal);
        staff.setAvgRating(Math.round(newAvg * 10.0) / 10.0);
        staffRepository.save(staff);
    }
}
