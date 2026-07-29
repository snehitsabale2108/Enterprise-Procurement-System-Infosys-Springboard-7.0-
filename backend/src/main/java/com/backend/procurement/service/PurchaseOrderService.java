package com.backend.procurement.service;

import com.backend.procurement.dto.PurchaseOrderDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;
    private final SupplierRepository supplierRepository;
    private final NotificationService notificationService;

    public List<PurchaseOrderDto> findAll() {
        return purchaseOrderRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    public PurchaseOrderDto findById(Long id) {
        return Mappers.toDto(purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", id)));
    }

    @Transactional
    public PurchaseOrderDto create(PurchaseOrderDto dto, User createdBy) {
        PurchaseRequest pr = purchaseRequestRepository.findById(dto.getPurchaseRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseRequest", dto.getPurchaseRequestId()));
        Supplier sup = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", dto.getSupplierId()));

        PurchaseOrder po = PurchaseOrder.builder()
                .poNumber("PO-" + System.currentTimeMillis())
                .purchaseRequest(pr).supplier(sup)
                .items(dto.getItems() != null ? dto.getItems() : pr.getDescription())
                .amount(dto.getAmount() != null ? dto.getAmount() : pr.getEstimatedCost())
                .status(dto.getStatus() != null ? dto.getStatus() : "ISSUED")
                .expectedDelivery(dto.getExpectedDelivery())
                .createdBy(createdBy).createdAt(LocalDateTime.now())
                .build();
        po = purchaseOrderRepository.save(po);

        pr.setCurrentStatus(RequestStatus.ORDERED);
        pr.setApprovalStage(ApprovalStage.COMPLETED);
        pr.setUpdatedAt(LocalDateTime.now());
        purchaseRequestRepository.save(pr);

        notificationService.notify(pr.getEmployee(), "PO_CREATED",
                "Purchase order created", "Order " + po.getPoNumber() + " issued to supplier " + sup.getName());
        return Mappers.toDto(po);
    }

    @Transactional
    public PurchaseOrderDto update(Long id, PurchaseOrderDto dto) {
        PurchaseOrder po = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", id));
        if (dto.getItems() != null) po.setItems(dto.getItems());
        if (dto.getAmount() != null) po.setAmount(dto.getAmount());
        if (dto.getStatus() != null) po.setStatus(dto.getStatus());
        if (dto.getExpectedDelivery() != null) po.setExpectedDelivery(dto.getExpectedDelivery());
        if (dto.getSupplierId() != null && (po.getSupplier() == null || !po.getSupplier().getId().equals(dto.getSupplierId()))) {
            Supplier sup = supplierRepository.findById(dto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", dto.getSupplierId()));
            po.setSupplier(sup);
        }
        return Mappers.toDto(purchaseOrderRepository.save(po));
    }
}
