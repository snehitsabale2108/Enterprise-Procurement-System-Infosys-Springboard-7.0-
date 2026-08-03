package com.eps.procurement.service;

import com.eps.procurement.model.*;
import com.eps.procurement.store.DataStore;
import java.util.*;
import org.springframework.stereotype.Service;

/** Aggregates the KPI payloads consumed by each role dashboard. */
@Service
public class DashboardService {

    private final DataStore store;

    public DashboardService(DataStore store) {
        this.store = store;
    }

    private static final Set<String> COMPLETED =
            Set.of("approved", "in_procurement", "delivered", "closed");

    public Map<String, Object> employee(String userId) {
        List<ProcurementRequest> mine = store.requests.stream()
                .filter(r -> r.createdBy.equals(userId))
                .toList();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", mine.size());
        stats.put("pending", mine.stream().filter(r -> r.status.startsWith("pending")).count());
        stats.put("approved", mine.stream().filter(r -> COMPLETED.contains(r.status)).count());
        stats.put("rejected", mine.stream().filter(r -> r.status.equals("rejected")).count());
        stats.put("inProgress", mine.stream().filter(r -> r.status.equals("in_procurement")).count());

        Map<String, Object> chart = store.chartData();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("recentRequests", mine.stream().limit(5).toList());
        body.put("monthlyRequests", chart.get("monthlyRequests"));
        body.put("categoryDistribution", chart.get("categoryDistribution"));
        return body;
    }

    public Map<String, Object> manager(String department) {
        List<ProcurementRequest> pending = store.requests.stream()
                .filter(r -> r.status.equals("pending_manager"))
                .filter(r -> department == null || department.isBlank() || r.department.equals(department))
                .toList();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("pendingApprovals", pending.size());
        stats.put("approvedThisMonth", countByStatus("approved"));
        stats.put("rejectedThisMonth", countByStatus("rejected"));
        stats.put("totalSpending", store.requests.stream()
                .filter(r -> COMPLETED.contains(r.status))
                .mapToDouble(r -> r.estimatedCost).sum());

        Map<String, Object> chart = store.chartData();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("pendingRequests", pending);
        body.put("approvalMetrics", chart.get("approvalMetrics"));
        body.put("departmentSpending", chart.get("departmentSpending"));
        return body;
    }

    public Map<String, Object> seniorManager() {
        List<ProcurementRequest> pending = store.requests.stream()
                .filter(r -> r.status.equals("pending_senior_manager"))
                .toList();
        double budget = store.departments.stream().mapToDouble(d -> d.budget).sum();
        double used = store.departments.stream().mapToDouble(d -> d.budgetUsed).sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("pendingApprovals", pending.size());
        stats.put("approvedThisMonth", countByStatus("approved"));
        stats.put("escalatedRequests", countByStatus("pending_head"));
        stats.put("budgetUtilization", Math.round((used / budget) * 100));

        Map<String, Object> chart = store.chartData();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("pendingRequests", pending);
        body.put("departmentSpending", chart.get("departmentSpending"));
        body.put("monthlySpending", chart.get("monthlySpending"));
        return body;
    }

    public Map<String, Object> head() {
        double budget = store.departments.stream().mapToDouble(d -> d.budget).sum();
        double used = store.departments.stream().mapToDouble(d -> d.budgetUsed).sum();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalProcurementSpend", used);
        stats.put("monthlySpend", 2100000);
        stats.put("annualSpend", used);
        stats.put("budgetAllocated", budget);
        stats.put("budgetUsed", used);
        stats.put("budgetRemaining", budget - used);
        stats.put("budgetUtilization", Math.round((used / budget) * 100));
        stats.put("activePOs", store.purchaseOrders.stream().filter(po -> !po.status.equals("closed")).count());
        stats.put("activeSuppliers", store.suppliers.stream().filter(s -> s.status.equals("active")).count());
        stats.put("pendingApprovals", countByStatus("pending_head"));

        Map<String, Object> chart = store.chartData();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("pendingRequests", store.requests.stream().filter(r -> r.status.equals("pending_head")).toList());
        body.put("categorySpending", chart.get("categoryDistribution"));
        body.put("departmentSpending", chart.get("departmentSpending"));
        body.put("monthlyTrends", chart.get("monthlySpending"));
        body.put("supplierPerformance", chart.get("supplierPerformance"));
        return body;
    }

    public Map<String, Object> procurement() {
        List<ProcurementRequest> approved = store.requests.stream()
                .filter(r -> r.status.equals("approved") || r.status.equals("in_procurement"))
                .toList();
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("approvedRequests", approved.size());
        stats.put("pendingPOs", store.purchaseOrders.stream()
                .filter(po -> po.status.equals("draft") || po.status.equals("sent")).count());
        stats.put("activePOs", store.purchaseOrders.stream().filter(po -> po.status.equals("accepted")).count());
        stats.put("completedOrders", store.purchaseOrders.stream().filter(po -> po.status.equals("closed")).count());

        Map<String, Object> chart = store.chartData();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("approvedRequests", approved);
        body.put("supplierPerformance", chart.get("supplierPerformance"));
        body.put("monthlyOrders", chart.get("monthlyRequests"));
        return body;
    }

    public Map<String, Object> finance() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("pendingInvoices", store.payments.stream().filter(p -> p.status.equals("pending")).count());
        stats.put("pendingPayments", store.payments.stream()
                .filter(p -> p.status.equals("processing") || p.status.equals("approved")).count());
        stats.put("paidInvoices", store.payments.stream().filter(p -> p.status.equals("paid")).count());
        stats.put("totalSpending", store.payments.stream()
                .filter(p -> p.status.equals("paid")).mapToDouble(p -> p.amount).sum());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("payments", store.payments);
        body.put("paymentTrend", store.chartData().get("paymentTrend"));
        return body;
    }

    public Map<String, Object> admin() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", store.users.size());
        stats.put("totalRoles", store.roles.size());
        stats.put("totalDepartments", store.departments.size());
        stats.put("totalCategories", store.categories.size());
        stats.put("totalSuppliers", store.suppliers.size());
        stats.put("totalAuditLogs", store.auditLogs.size());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("stats", stats);
        body.put("recentAuditLogs", store.auditLogs.stream().limit(5).toList());
        return body;
    }

    private long countByStatus(String status) {
        return store.requests.stream().filter(r -> r.status.equals(status)).count();
    }
}
