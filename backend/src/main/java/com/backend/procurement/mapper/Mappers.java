package com.backend.procurement.mapper;

import com.backend.procurement.dto.*;
import com.backend.procurement.entity.*;

public final class Mappers {
    private Mappers() {}

    public static UserDto toDto(User u) {
        if (u == null) return null;
        return UserDto.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .role(u.getRole() != null ? u.getRole().name() : null)
                .departmentId(u.getDepartment() != null ? u.getDepartment().getId() : null)
                .departmentName(u.getDepartment() != null ? u.getDepartment().getName() : null)
                .active(u.isActive())
                .build();
    }

    public static PurchaseRequestDto toDto(PurchaseRequest pr) {
        if (pr == null) return null;
        return PurchaseRequestDto.builder()
                .id(pr.getId())
                .requestNumber(pr.getRequestNumber())
                .employeeId(pr.getEmployee() != null ? pr.getEmployee().getId() : null)
                .employeeName(pr.getEmployee() != null ? pr.getEmployee().getFullName() : null)
                .departmentId(pr.getDepartment() != null ? pr.getDepartment().getId() : null)
                .departmentName(pr.getDepartment() != null ? pr.getDepartment().getName() : null)
                .category(pr.getCategory())
                .description(pr.getDescription())
                .quantity(pr.getQuantity())
                .estimatedCost(pr.getEstimatedCost())
                .justification(pr.getJustification())
                .priority(pr.getPriority() != null ? pr.getPriority().name() : null)
                .currentStatus(pr.getCurrentStatus() != null ? pr.getCurrentStatus().name() : null)
                .approvalStage(pr.getApprovalStage() != null ? pr.getApprovalStage().name() : null)
                .createdAt(pr.getCreatedAt())
                .build();
    }

    public static SupplierDto toDto(Supplier s) {
        if (s == null) return null;
        SupplierDto d = new SupplierDto();
        d.setId(s.getId());
        d.setName(s.getName());
        d.setContactPerson(s.getContactPerson());
        d.setPhone(s.getPhone());
        d.setEmail(s.getEmail());
        d.setAddress(s.getAddress());
        d.setStatus(s.getStatus());
        d.setRating(s.getRating());
        d.setKycExpiry(s.getKycExpiry());
        return d;
    }

    public static PurchaseOrderDto toDto(PurchaseOrder po) {
        if (po == null) return null;
        return PurchaseOrderDto.builder()
                .id(po.getId())
                .poNumber(po.getPoNumber())
                .purchaseRequestId(po.getPurchaseRequest() != null ? po.getPurchaseRequest().getId() : null)
                .supplierId(po.getSupplier() != null ? po.getSupplier().getId() : null)
                .supplierName(po.getSupplier() != null ? po.getSupplier().getName() : null)
                .items(po.getItems())
                .amount(po.getAmount())
                .status(po.getStatus())
                .expectedDelivery(po.getExpectedDelivery())
                .createdAt(po.getCreatedAt())
                .build();
    }

    public static GoodsReceiptDto toDto(GoodsReceipt g) {
        if (g == null) return null;
        return GoodsReceiptDto.builder()
                .id(g.getId())
                .grnNumber(g.getGrnNumber())
                .purchaseOrderId(g.getPurchaseOrder() != null ? g.getPurchaseOrder().getId() : null)
                .receivedQuantity(g.getReceivedQuantity())
                .acceptedQuantity(g.getAcceptedQuantity())
                .rejectedQuantity(g.getRejectedQuantity())
                .inspectionStatus(g.getInspectionStatus())
                .remarks(g.getRemarks())
                .receivedAt(g.getReceivedAt())
                .build();
    }

    public static InvoiceDto toDto(Invoice i) {
        if (i == null) return null;
        return InvoiceDto.builder()
                .id(i.getId())
                .invoiceNumber(i.getInvoiceNumber())
                .purchaseOrderId(i.getPurchaseOrder() != null ? i.getPurchaseOrder().getId() : null)
                .supplierId(i.getSupplier() != null ? i.getSupplier().getId() : null)
                .amount(i.getAmount())
                .status(i.getStatus())
                .invoiceDate(i.getInvoiceDate())
                .dueDate(i.getDueDate())
                .build();
    }

    public static PaymentDto toDto(Payment p) {
        if (p == null) return null;
        return PaymentDto.builder()
                .id(p.getId())
                .paymentNumber(p.getPaymentNumber())
                .invoiceId(p.getInvoice() != null ? p.getInvoice().getId() : null)
                .amount(p.getAmount())
                .status(p.getStatus())
                .paymentDate(p.getPaymentDate())
                .paymentMethod(p.getPaymentMethod())
                .referenceNumber(p.getReferenceNumber())
                .build();
    }

    public static NotificationDto toDto(Notification n) {
        if (n == null) return null;
        return NotificationDto.builder()
                .id(n.getId())
                .type(n.getType())
                .title(n.getTitle())
                .message(n.getMessage())
                .read(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }

    public static DepartmentDto toDto(Department d) {
        if (d == null) return null;
        DepartmentDto dto = new DepartmentDto();
        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setDescription(d.getDescription());
        dto.setBudgetAllocated(d.getBudgetAllocated());
        dto.setBudgetUsed(d.getBudgetUsed());
        return dto;
    }
}
