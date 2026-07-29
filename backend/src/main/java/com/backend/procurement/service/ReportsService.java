package com.backend.procurement.service;

import com.backend.procurement.entity.PurchaseRequest;
import com.backend.procurement.repository.DepartmentRepository;
import com.backend.procurement.repository.PaymentRepository;
import com.backend.procurement.repository.PurchaseRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportsService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final PaymentRepository paymentRepository;
    private final DepartmentRepository departmentRepository;

    public Map<String, Object> monthly() {
        LocalDate now = LocalDate.now();
        LocalDateTime start = now.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = LocalDateTime.now();
        List<PurchaseRequest> prs = purchaseRequestRepository.findByCreatedAtBetween(start, end);
        double total = prs.stream().mapToDouble(pr -> pr.getEstimatedCost() == null ? 0 : pr.getEstimatedCost()).sum();
        Map<String, Object> data = new HashMap<>();
        data.put("month", now.getMonth().name());
        data.put("year", now.getYear());
        data.put("requestCount", prs.size());
        data.put("totalEstimatedCost", total);
        return data;
    }

    public Map<String, Object> yearly() {
        int year = LocalDate.now().getYear();
        Map<String, Object> data = new HashMap<>();
        data.put("year", year);
        Map<String, Double> byMonth = new HashMap<>();
        for (Month m : Month.values()) {
            LocalDateTime start = LocalDate.of(year, m, 1).atStartOfDay();
            LocalDateTime end = start.plusMonths(1);
            double total = purchaseRequestRepository.findByCreatedAtBetween(start, end).stream()
                    .mapToDouble(pr -> pr.getEstimatedCost() == null ? 0 : pr.getEstimatedCost()).sum();
            byMonth.put(m.name(), total);
        }
        data.put("byMonth", byMonth);
        return data;
    }

    public Map<String, Object> budget() {
        Map<String, Object> data = new HashMap<>();
        data.put("departments", departmentRepository.findAll().stream().map(d -> Map.of(
                "id", d.getId(),
                "name", d.getName(),
                "allocated", d.getBudgetAllocated(),
                "used", d.getBudgetUsed(),
                "remaining", (d.getBudgetAllocated() == null ? 0 : d.getBudgetAllocated())
                        - (d.getBudgetUsed() == null ? 0 : d.getBudgetUsed())
        )).toList());
        return data;
    }

    public Map<String, Object> procurement() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalRequests", purchaseRequestRepository.count());
        data.put("totalPayments", paymentRepository.count());
        return data;
    }
}
