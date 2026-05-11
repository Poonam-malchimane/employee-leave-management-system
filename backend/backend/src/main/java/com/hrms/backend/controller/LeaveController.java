package com.hrms.backend.controller;

import com.hrms.backend.dto.DashboardDTO;
import com.hrms.backend.entity.Leave;
import com.hrms.backend.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    // ✅ Apply leave
    @PostMapping("/apply")
    public Leave applyLeave(@RequestBody Leave leave,
                            @RequestHeader("Authorization") String header) {

        String token = header.replace("Bearer ", "");

        return leaveService.applyLeave(leave, token);
    }

    // ✅ Admin: get all leaves
    @GetMapping("/all")
    public List<Leave> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    // ✅ User: get MY leaves (using token)
    @GetMapping("/my")
    public List<Leave> getMyLeaves(@RequestHeader("Authorization") String header) {

        String token = header.substring(7);

        return leaveService.getMyLeaves(token);
    }

    // ✅ Approve leave (ADMIN)
    @PutMapping("/approve/{id}")
    public Leave approve(@PathVariable Long id) {
        return leaveService.approveLeave(id);
    }

    // ✅ Reject leave (ADMIN)
    @PutMapping("/reject/{id}")
    public Leave reject(@PathVariable Long id) {
        return leaveService.rejectLeave(id);
    }
    @GetMapping("/status/{status}")
    public List<Leave> getByStatus(@PathVariable String status) {
        return leaveService.getLeavesByStatus(status);
    }
    @GetMapping("/my/status/{status}")
    public List<Leave> getMyLeavesByStatus(@PathVariable String status,
                                           @RequestHeader("Authorization") String header) {

        String token = header.substring(7);

        return leaveService.getMyLeavesByStatus(token, status);
    }
    @GetMapping("/dashboard/admin")
    public DashboardDTO adminDashboard() {
        return leaveService.getAdminDashboard();
    }
    @GetMapping("/dashboard/user")
    public DashboardDTO userDashboard(@RequestHeader("Authorization") String header) {

        String token = header.substring(7);

        return leaveService.getUserDashboard(token);
    }
}