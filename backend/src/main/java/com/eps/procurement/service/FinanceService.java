package com.eps.procurement.service;

import com.eps.procurement.model.Payment;
import com.eps.procurement.store.DataStore;
import java.time.LocalDate;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Invoice verification and payment processing. */
@Service
public class FinanceService {

    private final DataStore store;
    private final NotificationService notifications;

    public FinanceService(DataStore store, NotificationService notifications) {
        this.store = store;
        this.notifications = notifications;
    }

    public Map<String, Object> searchPayments(String status) {
        List<Payment> list = store.payments.stream()
                .filter(p -> status == null || status.isBlank() || p.status.equals(status))
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

    /** Three-way match: PO + GRN + invoice must all be verified before approval. */
    public Map<String, Object> verifyInvoice(Map<String, Object> body) {
        Payment payment = byId(String.valueOf(body.get("paymentId")));
        boolean poVerified = flag(body.get("poVerified"));
        boolean grnVerified = flag(body.get("grnVerified"));
        boolean invoiceVerified = flag(body.get("invoiceVerified"));
        boolean taxVerified = flag(body.get("taxVerified"));
        boolean amountVerified = flag(body.get("amountVerified"));

        if (!(poVerified && grnVerified && invoiceVerified && taxVerified && amountVerified)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "All verification checks must pass before the invoice can be approved");
        }
        payment.status = "approved";
        notifications.pushToRoles(java.util.List.of("finance_officer"), "invoice_verified", "Invoice Verified",
                "Invoice for " + payment.poNumber + " passed the three-way match and is ready for payment.",
                "/finance/payments");
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Invoice verified");
        response.put("status", "approved");
        response.put("payment", payment);
        return response;
    }

    public Map<String, Object> processPayment(Map<String, Object> body) {
        Payment payment = byId(String.valueOf(body.get("paymentId")));
        String method = body.get("paymentMethod") == null ? "NEFT" : String.valueOf(body.get("paymentMethod"));
        String reference = body.get("referenceNumber") == null || String.valueOf(body.get("referenceNumber")).isBlank()
                ? method + "-" + LocalDate.now().toString().replace("-", "") + "-" + payment.id
                : String.valueOf(body.get("referenceNumber"));

        payment.paymentMethod = method;
        payment.referenceNumber = reference;
        payment.status = "paid";
        payment.paidDate = LocalDate.now().toString();
        payment.transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        if (body.get("verifiedBy") != null) {
            payment.verifiedBy = String.valueOf(body.get("verifiedBy"));
        }

        notifySupplierOfPayment(payment);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Payment processed successfully");
        response.put("status", "paid");
        response.put("transactionId", payment.transactionId);
        response.put("payment", payment);
        return response;
    }

    private void notifySupplierOfPayment(Payment payment) {
        store.suppliers.stream()
                .filter(s -> s.companyName != null && s.companyName.equals(payment.supplierName))
                .findFirst()
                .ifPresent(s -> notifications.pushToSupplier(s.id, "payment_completed", "Payment Released",
                        "Payment of Rs " + Math.round(payment.amount) + " for " + payment.poNumber
                                + " has been released (" + payment.referenceNumber + ").",
                        "/supplier-portal"));
    }

    private boolean flag(Object value) {
        return Boolean.TRUE.equals(value) || "true".equalsIgnoreCase(String.valueOf(value));
    }
}
