package com.backend.procurement.service;

import com.backend.procurement.dto.GoodsReceiptDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.GoodsReceiptRepository;
import com.backend.procurement.repository.PurchaseOrderRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GoodsReceiptService {

    private final GoodsReceiptRepository goodsReceiptRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;

    public List<GoodsReceiptDto> findAll() {
        return goodsReceiptRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    @Transactional
    public GoodsReceiptDto create(GoodsReceiptDto dto, User receivedBy) {
        PurchaseOrder po = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", dto.getPurchaseOrderId()));
        int accepted = dto.getAcceptedQuantity() != null ? dto.getAcceptedQuantity() : dto.getReceivedQuantity();
        int rejected = dto.getRejectedQuantity() != null ? dto.getRejectedQuantity()
                : Math.max(0, dto.getReceivedQuantity() - accepted);

        GoodsReceipt g = GoodsReceipt.builder()
                .grnNumber("GRN-" + System.currentTimeMillis())
                .purchaseOrder(po)
                .receivedQuantity(dto.getReceivedQuantity())
                .acceptedQuantity(accepted)
                .rejectedQuantity(rejected)
                .inspectionStatus(dto.getInspectionStatus() != null ? dto.getInspectionStatus() : "ACCEPTED")
                .remarks(dto.getRemarks())
                .receivedBy(receivedBy).receivedAt(LocalDateTime.now())
                .build();
        g = goodsReceiptRepository.save(g);

        if (po.getPurchaseRequest() != null) {
            PurchaseRequest pr = po.getPurchaseRequest();
            pr.setCurrentStatus(RequestStatus.RECEIVED);
            pr.setUpdatedAt(LocalDateTime.now());
            purchaseRequestRepository.save(pr);
        }
        po.setStatus("RECEIVED");
        purchaseOrderRepository.save(po);
        return Mappers.toDto(g);
    }

    @Transactional
    public GoodsReceiptDto update(Long id, GoodsReceiptDto dto) {
        GoodsReceipt g = goodsReceiptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("GoodsReceipt", id));
        if (dto.getReceivedQuantity() != null) g.setReceivedQuantity(dto.getReceivedQuantity());
        if (dto.getAcceptedQuantity() != null) g.setAcceptedQuantity(dto.getAcceptedQuantity());
        if (dto.getRejectedQuantity() != null) g.setRejectedQuantity(dto.getRejectedQuantity());
        if (dto.getInspectionStatus() != null) g.setInspectionStatus(dto.getInspectionStatus());
        if (dto.getRemarks() != null) g.setRemarks(dto.getRemarks());
        return Mappers.toDto(goodsReceiptRepository.save(g));
    }
}
