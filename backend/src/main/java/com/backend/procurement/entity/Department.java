package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "budget_allocated")
    private Double budgetAllocated;

    @Column(name = "budget_used")
    private Double budgetUsed;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
