package com.backend.procurement.repository;

import com.backend.procurement.entity.ApprovalStage;
import com.backend.procurement.entity.PurchaseRequest;
import com.backend.procurement.entity.RequestStatus;
import com.backend.procurement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PurchaseRequestRepository extends JpaRepository<PurchaseRequest, Long> {
    List<PurchaseRequest> findByEmployee(User employee);
    List<PurchaseRequest> findByEmployeeOrderByCreatedAtDesc(User employee);
    List<PurchaseRequest> findByApprovalStageAndCurrentStatus(ApprovalStage stage, RequestStatus status);
    List<PurchaseRequest> findByCurrentStatus(RequestStatus status);
    long countByCurrentStatus(RequestStatus status);
    long countByEmployeeAndCurrentStatus(User employee, RequestStatus status);
    long countByApprovalStageAndCurrentStatus(ApprovalStage stage, RequestStatus status);
    List<PurchaseRequest> findTop10ByOrderByCreatedAtDesc();
    List<PurchaseRequest> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<PurchaseRequest> findByEstimatedCostGreaterThanEqual(Double amount);
}
