package com.backend.procurement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class PurchaseRequestDto {
    private Long id;
    private String requestNumber;
    private Long employeeId;
    private String employeeName;
    private Long departmentId;
    private String departmentName;
    private String category;
    private String description;
    private Integer quantity;
    private Double estimatedCost;
    private String justification;
    private String priority;
    private String currentStatus;
    private String approvalStage;
    private LocalDateTime createdAt;
}
