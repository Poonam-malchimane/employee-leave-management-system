
package com.hrms.backend.repository;

import com.hrms.backend.entity.Leave;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    List<Leave> findByUserId(Long userId);
    List<Leave> findByStatus(String status);
    List<Leave> findByUserIdAndStatus(Long userId, String status);
    long count();
    long countByStatus(String status);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, String status);

}