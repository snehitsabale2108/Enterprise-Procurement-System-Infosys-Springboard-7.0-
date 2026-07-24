package com.backend.procurement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Integer departmentId;

    @Column(name = "department_name", nullable = false)
    private String departmentName;

    @Column(name = "cost_center")
    private String costCenter;

    @OneToMany(mappedBy = "department")
    @Builder.Default
    private List<User> users = new ArrayList<>();
}