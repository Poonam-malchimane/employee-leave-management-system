package com.hrms.backend.service;

import com.hrms.backend.dto.DashboardDTO;
import com.hrms.backend.dto.LoginRequest;
import com.hrms.backend.entity.Leave;
import com.hrms.backend.entity.User;
import com.hrms.backend.repository.UserRepository;
import com.hrms.backend.repository.LeaveRepository;
import com.hrms.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Apply leave
    public Leave applyLeave(Leave leave, String token) {

        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDate start = LocalDate.parse(leave.getStartDate());
        LocalDate end   = LocalDate.parse(leave.getEndDate());
        LocalDate today = LocalDate.now();

        if (start.isBefore(today)) {
            throw new RuntimeException("Start date cannot be in the past");
        }
        if (end.isBefore(start)) {
            throw new RuntimeException("End date must be after start date");
        }

        leave.setUserId(user.getId());
        leave.setStatus("PENDING");

        Leave saved = leaveRepository.save(leave);

        // ✅ Email wrapped in try-catch so it never crashes the API
        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Leave Applied",
                    "Your leave request has been submitted successfully."
            );
        } catch (Exception e) {
            System.out.println("Email failed (non-critical): " + e.getMessage());
        }

        return saved;
    }

    // Get all leaves (Admin)
    public List<Leave> getAllLeaves() {
        return leaveRepository.findAll();
    }

    // Get user leaves
//    public List<Leave> getMyLeaves(Long userId) {
//        return leaveRepository.findByUserId(userId);
//    }

    // Approve leave
    public Leave approveLeave(Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        leave.setStatus("APPROVED");

        User user = userRepository.findById(leave.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Leave saved = leaveRepository.save(leave);

        // ✅ Email safe
        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Leave Approved",
                    "Your leave has been approved"
            );
        } catch (Exception e) {
            System.out.println("Email failed (non-critical): " + e.getMessage());
        }

        return saved;
    }

    // Reject leave
    public Leave rejectLeave(Long id) {

        Leave leave = leaveRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        leave.setStatus("REJECTED");

        User user = userRepository.findById(leave.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Leave saved = leaveRepository.save(leave);

        // ✅ Email safe
        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Leave Rejected",
                    "Your leave has been rejected"
            );
        } catch (Exception e) {
            System.out.println("Email failed (non-critical): " + e.getMessage());
        }

        return saved;
    }
    public List<Leave> getMyLeaves(String token) {

        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return leaveRepository.findByUserId(user.getId());
    }
    public List<Leave> getLeavesByStatus(String status) {
        return leaveRepository.findByStatus(status);
    }
    public List<Leave> getMyLeavesByStatus(String token, String status) {

        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return leaveRepository.findByUserIdAndStatus(user.getId(), status);
    }
    public DashboardDTO getAdminDashboard() {

        long total = leaveRepository.count();
        long pending = leaveRepository.countByStatus("PENDING");
        long approved = leaveRepository.countByStatus("APPROVED");
        long rejected = leaveRepository.countByStatus("REJECTED");

        return new DashboardDTO(total, pending, approved, rejected);
    }
    public DashboardDTO getUserDashboard(String token) {

        String email = JwtUtil.extractEmail(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long total = leaveRepository.countByUserId(user.getId());
        long pending = leaveRepository.countByUserIdAndStatus(user.getId(), "PENDING");
        long approved = leaveRepository.countByUserIdAndStatus(user.getId(), "APPROVED");
        long rejected = leaveRepository.countByUserIdAndStatus(user.getId(), "REJECTED");

        return new DashboardDTO(total, pending, approved, rejected);
    }
}