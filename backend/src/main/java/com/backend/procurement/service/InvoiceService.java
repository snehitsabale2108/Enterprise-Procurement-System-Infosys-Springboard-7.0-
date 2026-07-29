package com.backend.procurement.service;

import com.backend.procurement.dto.InvoiceDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.InvoiceRepository;
import com.backend.procurement.repository.PurchaseOrderRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;

    public List<InvoiceDto> findAll() {
        return invoiceRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    public InvoiceDto findById(Long id) {
        return Mappers.toDto(invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id)));
    }

    @Transactional
    public InvoiceDto create(InvoiceDto dto) {
        PurchaseOrder po = purchaseOrderRepository.findById(dto.getPurchaseOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("PurchaseOrder", dto.getPurchaseOrderId()));
        Invoice inv = Invoice.builder()
                .invoiceNumber("INV-" + System.currentTimeMillis())
                .purchaseOrder(po).supplier(po.getSupplier())
                .amount(dto.getAmount() != null ? dto.getAmount() : po.getAmount())
                .status(dto.getStatus() != null ? dto.getStatus() : "PENDING")
                .invoiceDate(dto.getInvoiceDate() != null ? dto.getInvoiceDate() : LocalDate.now())
                .dueDate(dto.getDueDate() != null ? dto.getDueDate() : LocalDate.now().plusDays(30))
                .createdAt(LocalDateTime.now())
                .build();
        inv = invoiceRepository.save(inv);

        if (po.getPurchaseRequest() != null) {
            PurchaseRequest pr = po.getPurchaseRequest();
            pr.setCurrentStatus(RequestStatus.INVOICED);
            pr.setUpdatedAt(LocalDateTime.now());
            purchaseRequestRepository.save(pr);
        }
        return Mappers.toDto(inv);
    }

    @Transactional
    public InvoiceDto update(Long id, InvoiceDto dto) {
        Invoice inv = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
        if (dto.getAmount() != null) inv.setAmount(dto.getAmount());
        if (dto.getStatus() != null) inv.setStatus(dto.getStatus());
        if (dto.getInvoiceDate() != null) inv.setInvoiceDate(dto.getInvoiceDate());
        if (dto.getDueDate() != null) inv.setDueDate(dto.getDueDate());
        return Mappers.toDto(invoiceRepository.save(inv));
    }
}
