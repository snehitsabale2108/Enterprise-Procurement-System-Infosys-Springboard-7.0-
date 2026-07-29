package com.backend.procurement.service;

import com.backend.procurement.dto.PaymentDto;
import com.backend.procurement.entity.*;
import com.backend.procurement.exception.ResourceNotFoundException;
import com.backend.procurement.mapper.Mappers;
import com.backend.procurement.repository.InvoiceRepository;
import com.backend.procurement.repository.PaymentRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PurchaseRequestRepository purchaseRequestRepository;

    public List<PaymentDto> findAll() {
        return paymentRepository.findAll().stream().map(Mappers::toDto).toList();
    }

    public List<PaymentDto> history() {
        return paymentRepository.findByStatus("COMPLETED").stream().map(Mappers::toDto).toList();
    }

    @Transactional
    public PaymentDto create(PaymentDto dto) {
        Invoice inv = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", dto.getInvoiceId()));
        Payment p = Payment.builder()
                .paymentNumber("PAY-" + System.currentTimeMillis())
                .invoice(inv)
                .amount(dto.getAmount() != null ? dto.getAmount() : inv.getAmount())
                .status(dto.getStatus() != null ? dto.getStatus() : "COMPLETED")
                .paymentDate(dto.getPaymentDate() != null ? dto.getPaymentDate() : LocalDate.now())
                .paymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "BANK_TRANSFER")
                .referenceNumber(dto.getReferenceNumber())
                .createdAt(LocalDateTime.now())
                .build();
        p = paymentRepository.save(p);

        inv.setStatus("PAID");
        invoiceRepository.save(inv);

        if (inv.getPurchaseOrder() != null && inv.getPurchaseOrder().getPurchaseRequest() != null) {
            PurchaseRequest pr = inv.getPurchaseOrder().getPurchaseRequest();
            pr.setCurrentStatus(RequestStatus.PAID);
            pr.setUpdatedAt(LocalDateTime.now());
            purchaseRequestRepository.save(pr);
        }
        return Mappers.toDto(p);
    }
}
