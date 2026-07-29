package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "goods_receipts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GoodsReceipt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "grn_number", nullable = false, unique = true, length = 50)
    private String grnNumber;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(name = "received_quantity", nullable = false)
    private Integer receivedQuantity;

    @Column(name = "accepted_quantity")
    private Integer acceptedQuantity;

    @Column(name = "rejected_quantity")
    private Integer rejectedQuantity;

    @Column(name = "inspection_status", length = 30)
    private String inspectionStatus;

    @Column(length = 1000)
    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "received_by")
    private User receivedBy;

    @Column(name = "received_at")
    private LocalDateTime receivedAt;
}
