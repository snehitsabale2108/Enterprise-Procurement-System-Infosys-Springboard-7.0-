package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "suppliers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Supplier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(name = "contact_person", length = 150)
    private String contactPerson;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String email;

    @Column(length = 500)
    private String address;

    @Column(length = 30)
    private String status;

    private Double rating;

    @Column(name = "kyc_expiry")
    private LocalDate kycExpiry;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
