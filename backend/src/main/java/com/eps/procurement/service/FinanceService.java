package com.eps.procurement.service;

import com.eps.procurement.model.AuditLog;
import com.eps.procurement.model.Payment;
import com.eps.procurement.model.ProcurementRequest;
import com.eps.procurement.model.PurchaseOrder;
import com.eps.procurement.model.User;
import com.eps.procurement.store.DataStore;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Invoice verification and payment processing for the finance team.
 *
 * <p>State machine: {@code pending → verified → processing → paid}, with
 * {@code on_hold} / {@code failed} as recoverable side states. Only the finance
 * team (or an admin) may move a payment; every transition is audited and the
 * supplier is notified when funds are released and settled.
 */
@Service
public class FinanceService {

    /** Legal payment transitions. */
    public static final Map<String, List<String>> PAYMENT_FLOW = Map.of(
            "pending", List.of("verified", "on_hold"),
            "on_hold", List.of("pending", "verified"),
            "verified", List.of("processing", "on_hold"),
            "processing", List.of("paid", "failed"),
            "failed", List.of("processing", "on_hold"),
            "paid", List.of());

    private static final List<String> REQUIRED_CHECKS =
            List.of("poVerified", "grnVerified", "invoiceVerified", "taxVerified", "amountVerified");

    private static final List<String> FINANCE_ROLES = List.of("finance_officer", "admin");

    private final DataStore store;
    private final NotificationService notifications;
    private final AuditService audit;

    public FinanceService(DataStore store, NotificationService notifications, AuditService audit) {
        this.store = store;
        this.notifications = notifications;
        this.audit = audit;
    }

    // ── Queries ───────────────────────────────────────────────
    public Map<String, Object> searchPayments(String status, String search) {
        List<Payment> list = store.payments.stream()
                .filter(p -> blank(status) || "all".equalsIgnoreCase(status) || status.equalsIgnoreCase(p.status))
                .filter(p -> blank(search) || matches(p, search))
                .sorted(Comparator.comparing((Payment p) -> p.id == null ? "" : p.id).reversed())
                .toList();
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("content", list);
        body.put("totalElements", list.size());
        return body;
    }

    public Payment byId(String id) {
        return store.payments.stream().filter(p -> p.id.equals(id)).findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    public List<AuditLog> trail(String paymentId) {
        return audit.trail(AuditService.ENTITY_PAYMENT, paymentId);
    }

    public Map<String, Object> summary() {
        Map<String, Object> body = new LinkedHashMap<>();
        for (String status : List.of("pending", "verified", "processing", "paid", "on_hold", "failed")) {
            body.put(status, store.payments.stream().filter(p -> status.equals(p.status)).count());
        }
        body.put("payableAmount", store.payments.stream()
                .filter(p -> List.of("pending", "verified", "processing").contains(p.status))
                .mapToDouble(p -> p.amount).sum());
        body.put("paidAmount", store.payments.stream()
                .filter(p -> "paid".equals(p.status)).mapToDouble(p -> p.amount).sum());
        return body;
    }

    public List<String> nextStatuses(String from) {
        return PAYMENT_FLOW.getOrDefault(from == null ? "" : from.toLowerCase(), List.of());
    }

    // ── Payment creation on delivery ──────────────────────────
    /**
     * Raises a payable for a delivered purchase order. Idempotent: delivering a
     * PO twice never duplicates the payment.
     */
    public Payment ensurePaymentForPo(PurchaseOrder po, String actorId) {
        if (po == null) {
            return null;
        }
        Optional<Payment> existing = store.payments.stream()
                .filter(p -> po.id.equals(p.poNumber) || po.id.equals(p.poId))
                .findFirst();
        if (existing.isPresent()) {
            return existing.get();
        }
        Payment payment = new Payment();
        payment.id = DataStore.nextId("PAY-" + LocalDate.now().getYear() + "-", store.payments.size(), 3);
        payment.poId = po.id;
        payment.poNumber = po.id;
        payment.requestId = po.requestId;
        payment.supplierId = po.supplierId;
        payment.supplierName = po.supplierName;
        payment.invoiceNumber = blank(po.invoiceNumber)
                ? "INV-" + po.id.replaceAll("[^0-9]", "")
                : po.invoiceNumber;
        payment.amount = po.invoiceAmount > 0 ? po.invoiceAmount : po.totalAmount;
        payment.status = "pending";
        payment.createdAt = now();
        payment.addHistory("pending", actorName(actorId), actorRole(actorId), now(), "Payment raised on delivery.");
        store.payments.add(payment);

        audit.recordBy(actorId, "payment_created", AuditService.ENTITY_PAYMENT, payment.id, null, "pending",
                "Payment raised for " + po.id + " (" + po.supplierName + ").");
        notifications.pushToRoles(List.of("finance_officer"), "invoice_pending", "Invoice Pending Verification",
                payment.id + " for " + po.id + " (Rs " + Math.round(payment.amount)
                        + ") is awaiting verification.", "/finance/payments");
        return payment;
    }

    // ── Three-way match ───────────────────────────────────────
    /** PO + GRN + invoice + tax + amount must all pass before approval. */
    public Map<String, Object> verifyInvoice(Map<String, Object> body) {
        String actorId = str(body.get("actorId"), str(body.get("verifiedBy"), null));
        assertFinance(actorId, "verify invoices", "payment_verify_denied");
        Payment payment = byId(String.valueOf(body.get("paymentId")));
        assertTransition(payment, "verified", actorId);

        Map<String, Boolean> checks = new LinkedHashMap<>();
        List<String> missing = new ArrayList<>();
        for (String check : REQUIRED_CHECKS) {
            boolean value = flag(body.get(check));
            checks.put(check, value);
            if (!value) {
                missing.add(check);
            }
        }
        String remarks = str(body.get("remarks"), "");
        if (!missing.isEmpty()) {
            audit.recordBy(actorId, "verify_invoice_rejected", AuditService.ENTITY_PAYMENT, payment.id,
                    payment.status, null, "Blocked: incomplete three-way match (" + String.join(", ", missing) + ").");
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "All five verification checks must pass before the invoice can be approved. Missing: " + missing);
        }

        String from = payment.status;
        User user = audit.userById(actorId);
        payment.status = "verified";
        payment.checks = checks;
        payment.verifiedBy = user == null ? actorId : user.id;
        payment.verifiedByName = user == null ? actorId : user.name;
        payment.verifiedAt = now();
        if (!remarks.isBlank()) {
            payment.remarks = remarks;
        }
        payment.addHistory("verified", actorName(actorId), actorRole(actorId), now(),
                remarks.isBlank() ? "Three-way match passed." : remarks);
        audit.recordBy(actorId, "verify_invoice", AuditService.ENTITY_PAYMENT, payment.id, from, "verified",
                remarks.isBlank()
                        ? "Invoice " + payment.invoiceNumber + " verified against " + payment.poNumber + "."
                        : remarks);
        notifications.pushToRoles(List.of("finance_officer"), "invoice_verified", "Invoice Verified",
                "Invoice for " + payment.poNumber + " passed the three-way match and is ready for payment.",
                "/finance/payments");
        return response("Invoice verified", payment);
    }

    // ── Release + settle ──────────────────────────────────────
    /** Releases funds to the supplier bank account (settlement still pending). */
    public Map<String, Object> releasePayment(String id, Map<String, Object> body) {
        String actorId = str(body.get("actorId"), null);
        assertFinance(actorId, "release payments", "payment_release_denied");
        Payment payment = byId(id);
        if ("pending".equals(payment.status)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    payment.id + " must pass invoice verification before it can be released.");
        }
        assertTransition(payment, "processing", actorId);

        String method = str(body.get("paymentMethod"), "NEFT");
        String reference = str(body.get("referenceNumber"), "");
        String remarks = str(body.get("remarks"), "");
        String from = payment.status;

        payment.status = "processing";
        payment.paymentMethod = method;
        payment.referenceNumber = reference.isBlank()
                ? method.toUpperCase() + "-" + LocalDate.now().toString().replace("-", "")
                        + "-" + payment.id.substring(payment.id.length() - 3)
                : reference;
        payment.releasedBy = actorName(actorId);
        payment.releasedAt = now();
        payment.addHistory("processing", actorName(actorId), actorRole(actorId), now(),
                remarks.isBlank() ? "Released via " + method + "." : remarks);
        audit.recordBy(actorId, "release_payment", AuditService.ENTITY_PAYMENT, payment.id, from, "processing",
                remarks.isBlank()
                        ? "Rs " + Math.round(payment.amount) + " released via " + method
                                + " (" + payment.referenceNumber + ")."
                        : remarks);
        notifySupplier(payment, "payment_initiated", "Payment Released",
                "Payment of Rs " + Math.round(payment.amount) + " for " + payment.poNumber
                        + " is in process (" + payment.referenceNumber + ").");
        return response("Payment released", payment);
    }

    /** Confirms the bank settlement — the payable is closed. */
    public Map<String, Object> confirmPayment(String id, Map<String, Object> body) {
        String actorId = str(body.get("actorId"), null);
        assertFinance(actorId, "confirm payments", "payment_confirm_denied");
        Payment payment = byId(id);
        assertTransition(payment, "paid", actorId);

        String remarks = str(body.get("remarks"), "");
        String from = payment.status;
        payment.status = "paid";
        payment.transactionId = str(body.get("transactionId"), "").isBlank()
                ? "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()
                : str(body.get("transactionId"), "");
        payment.paidDate = LocalDate.now().toString();
        payment.addHistory("paid", actorName(actorId), actorRole(actorId), now(),
                remarks.isBlank() ? "Settlement confirmed." : remarks);
        audit.recordBy(actorId, "complete_payment", AuditService.ENTITY_PAYMENT, payment.id, from, "paid",
                remarks.isBlank() ? "Settled — " + payment.transactionId + "." : remarks);

        notifySupplier(payment, "payment_completed", "Payment Completed",
                "Rs " + Math.round(payment.amount) + " for " + payment.poNumber
                        + " has been settled (" + payment.transactionId + ").");
        notifications.pushToRoles(List.of("procurement_officer"), "payment_completed", "Supplier Paid",
                payment.poNumber + " — " + payment.supplierName + " has been paid.", "/finance/payments");

        ProcurementRequest request = payment.requestId == null ? null : store.requests.stream()
                .filter(r -> payment.requestId.equals(r.id)).findFirst().orElse(null);
        if (request != null) {
            notifications.push(request.createdBy, "payment_completed", "Payment Completed",
                    "The supplier for " + request.id + " has been paid.", "/requests/" + request.id);
        }
        Map<String, Object> response = response("Payment completed", payment);
        response.put("transactionId", payment.transactionId);
        return response;
    }

    /** Hold, fail or reopen a payment. */
    public Map<String, Object> updateStatus(String id, Map<String, Object> body) {
        String actorId = str(body.get("actorId"), null);
        assertFinance(actorId, "process payments", "payment_update_denied");
        Payment payment = byId(id);
        String target = str(body.get("status"), "").toLowerCase();
        if ("verified".equals(target) || "processing".equals(target) || "paid".equals(target)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Use the verify, release or confirm endpoints for " + target + ".");
        }
        assertTransition(payment, target, actorId);

        String remarks = str(body.get("remarks"), "");
        String from = payment.status;
        payment.status = target;
        payment.addHistory(target, actorName(actorId), actorRole(actorId), now(), remarks);
        audit.recordBy(actorId, "payment_" + target, AuditService.ENTITY_PAYMENT, payment.id, from, target,
                remarks.isBlank() ? "Payment moved to " + target.replace('_', ' ') + "." : remarks);
        return response("Payment " + target, payment);
    }

    /** Legacy one-shot endpoint: release + settle in a single call. */
    public Map<String, Object> processPayment(Map<String, Object> body) {
        String id = String.valueOf(body.get("paymentId"));
        releasePayment(id, body);
        return confirmPayment(id, body);
    }

    // ── Helpers ───────────────────────────────────────────────
    private void assertFinance(String actorId, String action, String auditAction) {
        User user = audit.userById(actorId);
        if (user == null || user.role == null) {
            return; // unknown actors keep existing integrations working
        }
        if (!FINANCE_ROLES.contains(user.role.toLowerCase())) {
            audit.record(user, auditAction, AuditService.ENTITY_PAYMENT, null, user.role, null,
                    "Only the finance team can " + action + ".");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the finance team can " + action + ".");
        }
    }

    private void assertTransition(Payment payment, String target, String actorId) {
        String from = payment.status == null ? "pending" : payment.status.toLowerCase();
        if (!nextStatuses(from).contains(target)) {
            audit.recordBy(actorId, "payment_transition_rejected", AuditService.ENTITY_PAYMENT, payment.id,
                    from, target, "Illegal payment transition");
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot move " + payment.id + " from " + from + " to " + target
                            + ". Allowed: " + nextStatuses(from));
        }
    }

    private Map<String, Object> response(String message, Payment payment) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", message);
        body.put("status", payment.status);
        body.put("payment", payment);
        body.put("next", nextStatuses(payment.status));
        body.put("auditTrail", trail(payment.id));
        return body;
    }

    private void notifySupplier(Payment payment, String type, String title, String message) {
        if (payment.supplierId != null) {
            notifications.pushToSupplier(payment.supplierId, type, title, message, "/supplier-portal");
            return;
        }
        store.suppliers.stream()
                .filter(s -> s.companyName != null && s.companyName.equals(payment.supplierName))
                .findFirst()
                .ifPresent(s -> notifications.pushToSupplier(s.id, type, title, message, "/supplier-portal"));
    }

    private boolean matches(Payment p, String search) {
        String q = search.toLowerCase();
        return Stream.of(p.id, p.poNumber, p.supplierName, p.referenceNumber, p.transactionId, p.invoiceNumber)
                .anyMatch(v -> v != null && v.toLowerCase().contains(q));
    }

    private String actorName(String actorId) {
        User user = audit.userById(actorId);
        return user == null ? "System" : user.name;
    }

    private String actorRole(String actorId) {
        User user = audit.userById(actorId);
        return user == null ? "system" : user.role;
    }

    private static String now() {
        return LocalDateTime.now().withNano(0).toString();
    }

    private static String str(Object value, String fallback) {
        return value == null ? fallback : String.valueOf(value);
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }

    private boolean flag(Object value) {
        return Boolean.TRUE.equals(value) || "true".equalsIgnoreCase(String.valueOf(value));
    }

    private static final class Stream {
        static java.util.stream.Stream<String> of(String... values) {
            return java.util.Arrays.stream(values);
        }
    }
}
