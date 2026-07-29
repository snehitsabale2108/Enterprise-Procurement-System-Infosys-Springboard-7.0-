package com.backend.procurement.service;

import com.backend.procurement.entity.*;
import com.backend.procurement.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PurchaseRequestRepository purchaseRequestRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    public Map<String, Object> employee(User employee) {
        Map<String, Object> data = new HashMap<>();
        long pending = purchaseRequestRepository.countByEmployeeAndCurrentStatus(employee, RequestStatus.PENDING);
        long approved = purchaseRequestRepository.countByEmployeeAndCurrentStatus(employee, RequestStatus.APPROVED);
        long rejected = purchaseRequestRepository.countByEmployeeAndCurrentStatus(employee, RequestStatus.REJECTED);
        List<PurchaseRequest> recent = purchaseRequestRepository.findByEmployeeOrderByCreatedAtDesc(employee);
        data.put("pending", pending);
        data.put("approved", approved);
        data.put("rejected", rejected);
        data.put("recent", recent.stream().limit(10).map(com.backend.procurement.mapper.Mappers::toDto).toList());
        data.put("notifications", notificationService.summary(employee));
        data.put("currentApprovalStage", recent.stream().findFirst().map(pr -> pr.getApprovalStage() != null ? pr.getApprovalStage().name() : null).orElse(null));
        return data;
    }

    public Map<String, Object> manager() {
        LocalDateTime dayStart = LocalDate.now().atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);
        Map<String, Object> data = new HashMap<>();
        data.put("pendingApprovals", purchaseRequestRepository.countByApprovalStageAndCurrentStatus(ApprovalStage.MANAGER, RequestStatus.PENDING));
        data.put("approvedToday", purchaseRequestRepository.findByCreatedAtBetween(dayStart, dayEnd).stream()
                .filter(pr -> pr.getCurrentStatus() == RequestStatus.APPROVED).count());
        data.put("rejectedToday", purchaseRequestRepository.findByCreatedAtBetween(dayStart, dayEnd).stream()
                .filter(pr -> pr.getCurrentStatus() == RequestStatus.REJECTED).count());
        data.put("departmentRequests", purchaseRequestRepository.count());
        data.put("budgetAlerts", departmentRepository.findAll().stream()
                .filter(d -> d.getBudgetAllocated() != null && d.getBudgetUsed() != null
                        && d.getBudgetUsed() >= 0.8 * d.getBudgetAllocated())
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        data.put("recentActivities", purchaseRequestRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        return data;
    }

    public Map<String, Object> seniorManager() {
        Map<String, Object> data = new HashMap<>();
        data.put("highValueRequests", purchaseRequestRepository.findByEstimatedCostGreaterThanEqual(100000.0).stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        data.put("pendingDecisions", purchaseRequestRepository.countByApprovalStageAndCurrentStatus(
                ApprovalStage.SENIOR_MANAGER, RequestStatus.PENDING));
        data.put("departmentSummary", departmentRepository.findAll().stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        List<PurchaseRequest> month = purchaseRequestRepository.findByCreatedAtBetween(monthStart, LocalDateTime.now());
        double total = month.stream().mapToDouble(pr -> pr.getEstimatedCost() == null ? 0 : pr.getEstimatedCost()).sum();
        data.put("monthlyStatistics", Map.of("count", month.size(), "totalEstimatedCost", total));
        return data;
    }

    public Map<String, Object> head() {
        Map<String, Object> data = new HashMap<>();
        data.put("pendingFinalApprovals", purchaseRequestRepository.countByApprovalStageAndCurrentStatus(
                ApprovalStage.HEAD, RequestStatus.PENDING));
        data.put("totalRequests", purchaseRequestRepository.count());
        data.put("budgetUtilization", departmentRepository.findAll().stream().map(d -> Map.of(
                "department", d.getName(),
                "allocated", d.getBudgetAllocated(),
                "used", d.getBudgetUsed()
        )).toList());
        data.put("departmentPerformance", departmentRepository.findAll().stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        return data;
    }

    public Map<String, Object> finance() {
        Map<String, Object> data = new HashMap<>();
        data.put("pendingInvoices", invoiceRepository.findByStatus("PENDING").stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        data.put("pendingPayments", paymentRepository.findByStatus("PENDING").stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        double monthlySpend = paymentRepository.findByPaymentDateBetween(monthStart, LocalDate.now())
                .stream().mapToDouble(p -> p.getAmount() == null ? 0 : p.getAmount()).sum();
        data.put("monthlySpend", monthlySpend);
        data.put("outstandingPayments", invoiceRepository.findByStatus("PENDING").stream()
                .mapToDouble(i -> i.getAmount() == null ? 0 : i.getAmount()).sum());
        data.put("paymentHistory", paymentRepository.findByStatus("COMPLETED").stream()
                .map(com.backend.procurement.mapper.Mappers::toDto).toList());
        return data;
    }

    public Map<String, Object> admin() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("departments", departmentRepository.count());
        data.put("suppliers", supplierRepository.count());
        data.put("purchaseRequests", purchaseRequestRepository.count());
        data.put("purchaseOrders", purchaseOrderRepository.count());
        data.put("invoices", invoiceRepository.count());
        data.put("payments", paymentRepository.count());
        data.put("systemStatistics", Map.of(
                "usersByRole", java.util.Arrays.stream(Role.values())
                        .collect(java.util.stream.Collectors.toMap(Enum::name, userRepository::countByRole))
        ));
        return data;
    }
}
