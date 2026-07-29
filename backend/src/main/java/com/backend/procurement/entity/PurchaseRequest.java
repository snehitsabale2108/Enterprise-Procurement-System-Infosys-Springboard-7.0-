package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "purchase_requests")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(length = 100)
    private String category;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "estimated_cost", nullable = false)
    private Double estimatedCost;

    @Column(length = 1000)
    private String justification;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status", nullable = false, length = 30)
    private RequestStatus currentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_stage", length = 30)
    private ApprovalStage approvalStage;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
