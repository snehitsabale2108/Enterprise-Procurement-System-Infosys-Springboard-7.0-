package com.backend.procurement.repository;

import com.backend.procurement.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    long countByStatus(String status);
}
