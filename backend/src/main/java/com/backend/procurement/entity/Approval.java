package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Approval {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_request_id", nullable = false)
    private PurchaseRequest purchaseRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ApprovalStage stage;

    @Column(nullable = false, length = 20)
    private String action; // APPROVED, REJECTED, RETURNED

    @Column(length = 1000)
    private String comments;

    @Column(name = "action_date")
    private LocalDateTime actionDate;
}
