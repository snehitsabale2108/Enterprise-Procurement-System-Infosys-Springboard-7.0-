package com.backend.procurement.repository;

import com.backend.procurement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByStatus(String status);
    List<Payment> findByPaymentDateBetween(LocalDate start, LocalDate end);
    long countByStatus(String status);
}
