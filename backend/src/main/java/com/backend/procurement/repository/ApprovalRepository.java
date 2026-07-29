package com.backend.procurement.repository;

import com.backend.procurement.entity.Approval;
import com.backend.procurement.entity.PurchaseRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    List<Approval> findByPurchaseRequestOrderByActionDateAsc(PurchaseRequest pr);
}
