package com.eps.procurement.store;

import com.eps.procurement.model.*;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.stereotype.Component;

/**
 * In-memory data store for the demo backend.
 *
 * <p>All collections are seeded on startup with realistic demo data so the whole
 * application can be presented without any external database. Swapping this class
 * for Spring Data JPA repositories is the only change needed to go persistent.
 */
@Component
public class DataStore {

    public final List<User> users = new CopyOnWriteArrayList<>();
    public final List<Department> departments = new CopyOnWriteArrayList<>();
    public final List<Category> categories = new CopyOnWriteArrayList<>();
    public final List<ProcurementRequest> requests = new CopyOnWriteArrayList<>();
    public final List<ApprovalRecord> approvalHistory = new CopyOnWriteArrayList<>();
    public final List<Supplier> suppliers = new CopyOnWriteArrayList<>();
    public final List<PurchaseOrder> purchaseOrders = new CopyOnWriteArrayList<>();
    public final List<GoodsReceiptNote> goodsReceiptNotes = new CopyOnWriteArrayList<>();
    public final List<SoftwareLicense> softwareLicenses = new CopyOnWriteArrayList<>();
    public final List<Payment> payments = new CopyOnWriteArrayList<>();
    public final List<Notification> notifications = new CopyOnWriteArrayList<>();
    public final List<Quotation> quotations = new CopyOnWriteArrayList<>();
    public final List<AuditLog> auditLogs = new CopyOnWriteArrayList<>();
    public final List<ApprovalRule> approvalRules = new CopyOnWriteArrayList<>();
    public final List<Role> roles = new CopyOnWriteArrayList<>();

    /** token -> userId, issued by the auth service. */
    public final Map<String, String> activeTokens = new HashMap<>();

    @PostConstruct
    public void seed() {
        seedUsers();
        seedDepartments();
        seedCategories();
        seedRequests();
        seedApprovalHistory();
        seedSuppliers();
        seedPurchaseOrders();
        seedGrns();
        seedLicenses();
        seedPayments();
        seedNotifications();
        seedQuotations();
        seedAuditLogs();
        seedApprovalRules();
        seedRoles();
    }

    private void seedUsers() {
        users.addAll(List.of(
            new User("U001", "Ravi Kumar", "ravi@company.com", "employee", "Engineering", "#6366f1", "9876543210", "active", "2024-01-15", "password123"),
            new User("U002", "Priya Sharma", "priya@company.com", "employee", "Marketing", "#ec4899", "9876543211", "active", "2024-02-10", "password123"),
            new User("U003", "Anand Mehta", "anand@company.com", "manager", "Engineering", "#06b6d4", "9876543212", "active", "2023-06-20", "password123"),
            new User("U004", "Sunita Reddy", "sunita@company.com", "senior_manager", "Engineering", "#f59e0b", "9876543213", "active", "2023-03-15", "password123"),
            new User("U005", "Vikram Singh", "vikram@company.com", "head", "Corporate", "#10b981", "9876543214", "active", "2022-01-10", "password123"),
            new User("U006", "Deepa Nair", "deepa@company.com", "procurement_officer", "Procurement", "#8b5cf6", "9876543215", "active", "2023-08-01", "password123"),
            new User("U007", "Rajesh Patel", "rajesh@company.com", "equipment_team", "Procurement", "#14b8a6", "9876543216", "active", "2023-09-12", "password123"),
            new User("U008", "Kavita Joshi", "kavita@company.com", "software_team", "IT", "#f472b6", "9876543217", "active", "2023-07-05", "password123"),
            new User("U009", "Arun Gupta", "arun@company.com", "facilities_team", "Facilities", "#fbbf24", "9876543218", "active", "2023-10-20", "password123"),
            new User("U010", "Lakshmi Iyer", "lakshmi@company.com", "finance_officer", "Finance", "#34d399", "9876543219", "active", "2023-04-18", "password123"),
            new User("U011", "Mohit Verma", "mohit@company.com", "admin", "IT", "#ef4444", "9876543220", "active", "2022-11-01", "password123"),
            new User("U012", "Neha Kulkarni", "neha@company.com", "employee", "HR", "#a78bfa", "9876543221", "active", "2024-03-05", "password123")
        ));
    }

    private void seedDepartments() {
        departments.addAll(List.of(
            new Department("D001", "Engineering", "Sunita Reddy", 5000000, 3200000, 45, "active"),
            new Department("D002", "Marketing", "Anil Kapoor", 3000000, 1800000, 22, "active"),
            new Department("D003", "HR", "Meera Saxena", 2000000, 900000, 12, "active"),
            new Department("D004", "Finance", "Suresh Rajan", 1500000, 750000, 15, "active"),
            new Department("D005", "IT", "Mohit Verma", 8000000, 5600000, 35, "active"),
            new Department("D006", "Procurement", "Deepa Nair", 2000000, 1100000, 10, "active"),
            new Department("D007", "Facilities", "Arun Gupta", 4000000, 2400000, 18, "active"),
            new Department("D008", "Corporate", "Vikram Singh", 10000000, 6500000, 8, "active")
        ));
    }

    private void seedCategories() {
        categories.addAll(List.of(
            new Category("C001", "Equipment & Assets",
                List.of("Laptop", "Desktop", "Monitor", "Keyboard", "Mouse", "Headset", "Webcam", "Docking Station"),
                "equipment_team", "Monitor"),
            new Category("C002", "Software & Digital Services",
                List.of("Software License", "SaaS Subscription", "API Service", "AI Service", "Cloud Service", "Development Tool"),
                "software_team", "Code"),
            new Category("C003", "Facilities",
                List.of("Furniture", "Electrical Appliance", "Office Equipment", "Repairs", "Renovation", "Cleaning Supplies"),
                "facilities_team", "Building")
        ));
    }

    private void seedRequests() {
        requests.addAll(List.of(
            new ProcurementRequest("REQ-2024-001", "MacBook Pro 16 inch", "Need a MacBook Pro for development work. Current laptop is 4 years old and causing productivity issues.", "Current laptop performance is degrading", "Equipment & Assets", "Laptop", 1, 189000, "Engineering", "2024-04-15", "approved", "U001", "2024-03-01", "2024-03-05", "high"),
            new ProcurementRequest("REQ-2024-002", "Adobe Creative Cloud License", "Annual subscription for design team", "Design team needs updated tools", "Software & Digital Services", "Software License", 5, 175000, "Marketing", "2024-04-01", "pending_senior_manager", "U002", "2024-03-05", "2024-03-08", "medium"),
            new ProcurementRequest("REQ-2024-003", "Standing Desk", "Ergonomic standing desk for better posture", "Health and ergonomics", "Facilities", "Furniture", 3, 45000, "Engineering", "2024-04-20", "pending_manager", "U001", "2024-03-10", "2024-03-10", "low"),
            new ProcurementRequest("REQ-2024-004", "Dell UltraSharp 27\" Monitor", "4K monitor for dual display setup", "Productivity improvement", "Equipment & Assets", "Monitor", 2, 72000, "Engineering", "2024-04-10", "pending_manager", "U012", "2024-03-12", "2024-03-12", "medium"),
            new ProcurementRequest("REQ-2024-005", "Jira Software Cloud Premium", "Project management tool upgrade", "Better project tracking needed", "Software & Digital Services", "SaaS Subscription", 1, 320000, "IT", "2024-04-01", "pending_head", "U001", "2024-03-02", "2024-03-12", "high"),
            new ProcurementRequest("REQ-2024-006", "Office Chairs - Ergonomic", "Replace old office chairs with ergonomic models", "Employee comfort and health", "Facilities", "Furniture", 10, 250000, "HR", "2024-05-01", "approved", "U012", "2024-02-20", "2024-03-10", "medium"),
            new ProcurementRequest("REQ-2024-007", "GitHub Enterprise License", "Enterprise license for the development team", "Security and compliance requirements", "Software & Digital Services", "Software License", 1, 480000, "Engineering", "2024-04-15", "in_procurement", "U001", "2024-02-15", "2024-03-15", "high"),
            new ProcurementRequest("REQ-2024-008", "Wireless Keyboard & Mouse Set", "Logitech MX Keys and MX Master 3S", "Old peripherals malfunctioning", "Equipment & Assets", "Keyboard", 5, 62500, "Marketing", "2024-04-05", "draft", "U002", "2024-03-14", "2024-03-14", "low"),
            new ProcurementRequest("REQ-2024-009", "Conference Room Renovation", "Renovation of main conference room including AV equipment", "Outdated facilities", "Facilities", "Renovation", 1, 850000, "Facilities", "2024-06-01", "approved", "U009", "2024-01-20", "2024-03-01", "high"),
            new ProcurementRequest("REQ-2024-010", "AWS Cloud Credits", "Cloud infrastructure credits for Q2", "Scaling production infrastructure", "Software & Digital Services", "Cloud Service", 1, 500000, "Engineering", "2024-04-01", "rejected", "U001", "2024-02-28", "2024-03-08", "high"),
            new ProcurementRequest("REQ-2024-011", "Logitech Webcam C930e", "HD webcam for video conferencing", "Remote meetings quality", "Equipment & Assets", "Webcam", 8, 56000, "Engineering", "2024-04-10", "delivered", "U001", "2024-01-15", "2024-03-10", "medium"),
            new ProcurementRequest("REQ-2024-012", "Slack Enterprise Grid", "Upgrade communication platform", "Enterprise security features needed", "Software & Digital Services", "SaaS Subscription", 1, 420000, "IT", "2024-05-01", "closed", "U001", "2024-01-05", "2024-03-15", "high")
        ));
    }

    private void seedApprovalHistory() {
        approvalHistory.addAll(List.of(
            new ApprovalRecord("AH001", "REQ-2024-001", "Anand Mehta", "manager", "approved", "Approved. Good justification for the upgrade.", "2024-03-02T10:30:00"),
            new ApprovalRecord("AH002", "REQ-2024-001", "Sunita Reddy", "senior_manager", "approved", "Within budget. Approved.", "2024-03-04T14:15:00"),
            new ApprovalRecord("AH003", "REQ-2024-001", "Vikram Singh", "head", "approved", "Final approval granted.", "2024-03-05T09:00:00"),
            new ApprovalRecord("AH004", "REQ-2024-002", "Anand Mehta", "manager", "approved", "Design team definitely needs this.", "2024-03-07T11:00:00"),
            new ApprovalRecord("AH005", "REQ-2024-005", "Anand Mehta", "manager", "approved", "Project management is critical. Approved.", "2024-03-05T16:00:00"),
            new ApprovalRecord("AH006", "REQ-2024-005", "Sunita Reddy", "senior_manager", "approved", "Escalating to Head due to high value.", "2024-03-10T09:30:00"),
            new ApprovalRecord("AH007", "REQ-2024-010", "Anand Mehta", "manager", "approved", "Infrastructure is important.", "2024-03-03T10:00:00"),
            new ApprovalRecord("AH008", "REQ-2024-010", "Sunita Reddy", "senior_manager", "rejected", "Budget exceeded for this quarter. Re-submit next quarter.", "2024-03-08T15:00:00"),
            new ApprovalRecord("AH009", "REQ-2024-006", "Anand Mehta", "manager", "approved", "Employee welfare. Approved.", "2024-02-25T10:00:00"),
            new ApprovalRecord("AH010", "REQ-2024-006", "Sunita Reddy", "senior_manager", "approved", "Good for morale. Approved.", "2024-03-01T11:00:00"),
            new ApprovalRecord("AH011", "REQ-2024-006", "Vikram Singh", "head", "approved", "Final approval.", "2024-03-05T14:00:00")
        ));
    }

    private void seedSuppliers() {
        suppliers.addAll(List.of(
            new Supplier("S001", "TechnoHub India Pvt Ltd", "IT Equipment Distributor", "29AABCT1234F1Z5", "AABCT1234F", "HDFC Bank", "50200012345678", "HDFC0001234", "Amit Shah", "9988776655", "sales@technohub.in", "123, Electronic City, Bangalore - 560100", "active", 4.5, 28, "2023-01-10"),
            new Supplier("S002", "SoftLicense Solutions", "Software Reseller", "27BBCSL5678G2H6", "BBCSL5678G", "ICICI Bank", "60300098765432", "ICIC0005678", "Neha Deshmukh", "9877665544", "info@softlicense.com", "456, Baner Road, Pune - 411045", "active", 4.2, 15, "2023-03-20"),
            new Supplier("S003", "FurniCraft Enterprises", "Furniture Manufacturer", "36CCFCE9012H3I7", "CCFCE9012H", "SBI", "40100056789012", "SBIN0009012", "Ramesh Babu", "9766554433", "orders@furnicraft.in", "789, HITEC City, Hyderabad - 500081", "active", 4.0, 12, "2023-05-15"),
            new Supplier("S004", "CloudFirst Technologies", "Cloud Services Provider", "07DDCFT3456I4J8", "DDCFT3456I", "Axis Bank", "70400034567890", "UTIB0003456", "Sanjay Malhotra", "9655443322", "enterprise@cloudfirst.io", "321, Connaught Place, New Delhi - 110001", "active", 4.8, 8, "2023-08-01"),
            new Supplier("S005", "ElectroPro Services", "Electrical Contractor", "33EEPRS7890J5K9", "EEPRS7890J", "Kotak Bank", "80500023456789", "KKBK0007890", "Vijay Krishnan", "9544332211", "service@electropro.in", "654, Anna Nagar, Chennai - 600040", "suspended", 3.2, 5, "2023-04-10"),
            new Supplier("S006", "InfraBuilders Co", "Construction & Renovation", "29IIBCO2345K6L0", "IIBCO2345K", "Yes Bank", "90600012345678", "YESB0002345", "Prakash Shetty", "9433221100", "projects@infrabuilders.in", "987, Koramangala, Bangalore - 560034", "active", 3.8, 6, "2023-09-25")
        ));
    }

    private void seedPurchaseOrders() {
        purchaseOrders.addAll(List.of(
            new PurchaseOrder("PO-2024-001", "REQ-2024-001", "S001", "TechnoHub India Pvt Ltd",
                new ArrayList<>(List.of(new PurchaseOrderItem("MacBook Pro 16\" M3 Pro", 1, 185000, 185000))),
                185000, 33300, 218300, "2024-04-10", "delivered", "2024-03-06", "U006"),
            new PurchaseOrder("PO-2024-002", "REQ-2024-006", "S003", "FurniCraft Enterprises",
                new ArrayList<>(List.of(new PurchaseOrderItem("Ergonomic Office Chair - Herman Miller Clone", 10, 22000, 220000))),
                220000, 39600, 259600, "2024-04-25", "accepted", "2024-03-12", "U006"),
            new PurchaseOrder("PO-2024-003", "REQ-2024-007", "S002", "SoftLicense Solutions",
                new ArrayList<>(List.of(new PurchaseOrderItem("GitHub Enterprise Server - Annual License", 1, 450000, 450000))),
                450000, 81000, 531000, "2024-04-01", "sent", "2024-03-16", "U006"),
            new PurchaseOrder("PO-2024-004", "REQ-2024-009", "S006", "InfraBuilders Co",
                new ArrayList<>(List.of(
                    new PurchaseOrderItem("Conference Room Full Renovation", 1, 750000, 750000),
                    new PurchaseOrderItem("AV Equipment Installation", 1, 85000, 85000))),
                835000, 150300, 985300, "2024-05-15", "accepted", "2024-03-05", "U006"),
            new PurchaseOrder("PO-2024-005", "REQ-2024-011", "S001", "TechnoHub India Pvt Ltd",
                new ArrayList<>(List.of(new PurchaseOrderItem("Logitech C930e Webcam", 8, 6500, 52000))),
                52000, 9360, 61360, "2024-03-05", "closed", "2024-02-01", "U006"),
            new PurchaseOrder("PO-2024-006", "REQ-2024-012", "S002", "SoftLicense Solutions",
                new ArrayList<>(List.of(new PurchaseOrderItem("Slack Enterprise Grid - Annual", 1, 400000, 400000))),
                400000, 72000, 472000, "2024-02-15", "closed", "2024-01-10", "U006")
        ));
    }

    private void seedGrns() {
        goodsReceiptNotes.addAll(List.of(
            new GoodsReceiptNote("GRN-2024-001", "PO-2024-001",
                new ArrayList<>(List.of(new GrnItem("MacBook Pro 16\" M3 Pro", 1, 1, "passed"))),
                "2024-04-08", "U007", "U001", true, "All items in perfect condition", "completed"),
            new GoodsReceiptNote("GRN-2024-002", "PO-2024-005",
                new ArrayList<>(List.of(new GrnItem("Logitech C930e Webcam", 8, 8, "passed"))),
                "2024-03-04", "U007", "U001", true, "All webcams tested and working", "completed")
        ));
    }

    private void seedLicenses() {
        softwareLicenses.addAll(List.of(
            new SoftwareLicense("LIC-001", "GitHub Enterprise", "GitHub / Microsoft", "GH-ENT-XXXX-YYYY", 50, 42, "2025-04-15", "active", 450000, new ArrayList<>(List.of("U001", "U002", "U012"))),
            new SoftwareLicense("LIC-002", "Slack Enterprise Grid", "Slack / Salesforce", "SLK-GRID-XXXX", 200, 156, "2025-02-15", "active", 400000, new ArrayList<>()),
            new SoftwareLicense("LIC-003", "Adobe Creative Cloud", "Adobe Inc", "ADO-CC-XXXX", 10, 8, "2024-12-31", "active", 175000, new ArrayList<>(List.of("U002"))),
            new SoftwareLicense("LIC-004", "Jira Software Cloud", "Atlassian", "JIRA-CLD-XXXX", 100, 67, "2024-09-30", "active", 280000, new ArrayList<>()),
            new SoftwareLicense("LIC-005", "Microsoft 365 E5", "Microsoft", "M365-E5-XXXX", 250, 210, "2025-06-30", "active", 800000, new ArrayList<>())
        ));
    }

    private void seedPayments() {
        payments.addAll(List.of(
            new Payment("PAY-2024-001", "PO-2024-005", "TechnoHub India Pvt Ltd", 61360, "NEFT", "NEFT-20240310-001", "paid", "2024-03-10", "U010", "TXN-HDFC-20240310-001"),
            new Payment("PAY-2024-002", "PO-2024-006", "SoftLicense Solutions", 472000, "RTGS", "RTGS-20240220-001", "paid", "2024-02-20", "U010", "TXN-HDFC-20240220-001"),
            new Payment("PAY-2024-003", "PO-2024-001", "TechnoHub India Pvt Ltd", 218300, "NEFT", "NEFT-20240415-001", "processing", null, "U010", null),
            new Payment("PAY-2024-004", "PO-2024-002", "FurniCraft Enterprises", 259600, "NEFT", null, "pending", null, null, null),
            new Payment("PAY-2024-005", "PO-2024-004", "InfraBuilders Co", 985300, "RTGS", null, "pending", null, null, null)
        ));
    }

    private void seedNotifications() {
        notifications.addAll(List.of(
            new Notification("N001", "U001", "request_approved", "Request Approved", "Your request REQ-2024-001 (MacBook Pro) has been fully approved.", false, "2024-03-05T09:05:00", "/requests/REQ-2024-001"),
            new Notification("N002", "U001", "po_created", "Purchase Order Created", "PO-2024-001 has been created for your MacBook Pro request.", false, "2024-03-06T11:00:00", "/purchase-orders/PO-2024-001"),
            new Notification("N003", "U001", "delivery_completed", "Delivery Completed", "Your MacBook Pro has been delivered. Please confirm handover.", true, "2024-04-08T15:00:00", "/requests/REQ-2024-001"),
            new Notification("N004", "U003", "pending_approval", "New Approval Request", "REQ-2024-003 from Ravi Kumar requires your approval.", false, "2024-03-10T10:00:00", "/approvals"),
            new Notification("N005", "U003", "pending_approval", "New Approval Request", "REQ-2024-004 from Neha Kulkarni requires your approval.", false, "2024-03-12T09:30:00", "/approvals"),
            new Notification("N006", "U006", "request_approved", "Request Ready for Procurement", "REQ-2024-007 has been approved and is ready for procurement.", true, "2024-03-15T10:00:00", "/procurement"),
            new Notification("N007", "U010", "invoice_pending", "Invoice Pending Verification", "Invoice for PO-2024-001 is pending your verification.", false, "2024-04-10T08:00:00", "/finance/invoices"),
            new Notification("N008", "U001", "request_rejected", "Request Rejected", "Your request REQ-2024-010 (AWS Cloud Credits) has been rejected.", true, "2024-03-08T15:30:00", "/requests/REQ-2024-010")
        ));
    }

    private void seedQuotations() {
        quotations.addAll(List.of(
            new Quotation("Q001", "REQ-2024-001", "S001", "TechnoHub India Pvt Ltd",
                new ArrayList<>(List.of(new QuotationItem("MacBook Pro 16\" M3 Pro", 185000, 1))), 185000, "2024-04-30", "accepted", "2024-03-04"),
            new Quotation("Q002", "REQ-2024-001", "S004", "CloudFirst Technologies",
                new ArrayList<>(List.of(new QuotationItem("MacBook Pro 16\" M3 Pro", 192000, 1))), 192000, "2024-04-30", "rejected", "2024-03-04"),
            new Quotation("Q003", "REQ-2024-006", "S003", "FurniCraft Enterprises",
                new ArrayList<>(List.of(new QuotationItem("Ergonomic Office Chair", 22000, 10))), 220000, "2024-05-15", "accepted", "2024-03-10"),
            new Quotation("Q004", "REQ-2024-006", "S006", "InfraBuilders Co",
                new ArrayList<>(List.of(new QuotationItem("Ergonomic Office Chair", 25000, 10))), 250000, "2024-05-15", "rejected", "2024-03-10")
        ));
    }

    private void seedAuditLogs() {
        auditLogs.addAll(List.of(
            new AuditLog("AL001", "U001", "Ravi Kumar", "employee", "CREATE_REQUEST", "Request", "REQ-2024-001", null, "Draft created", "192.168.1.100", "2024-03-01T09:00:00", "New procurement request created"),
            new AuditLog("AL002", "U001", "Ravi Kumar", "employee", "SUBMIT_REQUEST", "Request", "REQ-2024-001", "draft", "pending_manager", "192.168.1.100", "2024-03-01T09:15:00", "Request submitted for approval"),
            new AuditLog("AL003", "U003", "Anand Mehta", "manager", "APPROVE_REQUEST", "Request", "REQ-2024-001", "pending_manager", "pending_senior_manager", "192.168.1.105", "2024-03-02T10:30:00", "Manager approved. Forwarded to Senior Manager."),
            new AuditLog("AL004", "U004", "Sunita Reddy", "senior_manager", "APPROVE_REQUEST", "Request", "REQ-2024-001", "pending_senior_manager", "pending_head", "192.168.1.110", "2024-03-04T14:15:00", "Senior Manager approved. Escalated to Head."),
            new AuditLog("AL005", "U005", "Vikram Singh", "head", "APPROVE_REQUEST", "Request", "REQ-2024-001", "pending_head", "approved", "192.168.1.115", "2024-03-05T09:00:00", "Head gave final approval."),
            new AuditLog("AL006", "U006", "Deepa Nair", "procurement_officer", "CREATE_PO", "PurchaseOrder", "PO-2024-001", null, "PO Created", "192.168.1.120", "2024-03-06T11:00:00", "Purchase Order created for MacBook Pro."),
            new AuditLog("AL007", "U011", "Mohit Verma", "admin", "UPDATE_USER", "User", "U005", "{\"role\":\"senior_manager\"}", "{\"role\":\"head\"}", "192.168.1.130", "2024-01-10T08:00:00", "Promoted Vikram Singh to Head role."),
            new AuditLog("AL008", "U010", "Lakshmi Iyer", "finance_officer", "PROCESS_PAYMENT", "Payment", "PAY-2024-001", "pending", "paid", "192.168.1.125", "2024-03-10T14:00:00", "Payment processed via NEFT."),
            new AuditLog("AL009", "U004", "Sunita Reddy", "senior_manager", "REJECT_REQUEST", "Request", "REQ-2024-010", "pending_senior_manager", "rejected", "192.168.1.110", "2024-03-08T15:00:00", "Budget exceeded for this quarter."),
            new AuditLog("AL010", "U011", "Mohit Verma", "admin", "CREATE_SUPPLIER", "Supplier", "S001", null, "Supplier created", "192.168.1.130", "2023-01-10T10:00:00", "New supplier TechnoHub India added.")
        ));
    }

    private void seedApprovalRules() {
        approvalRules.addAll(List.of(
            new ApprovalRule("AR001", 0, 50000, List.of("manager"), "Low value: Manager approval only"),
            new ApprovalRule("AR002", 50001, 200000, List.of("manager", "senior_manager"), "Medium value: Manager + Senior Manager"),
            new ApprovalRule("AR003", 200001, 999999999, List.of("manager", "senior_manager", "head"), "High value: Manager + Senior Manager + Head")
        ));
    }

    private void seedRoles() {
        roles.addAll(List.of(
            new Role("R001", "employee", "Employee", List.of("create_request", "view_own_requests", "edit_draft", "cancel_request")),
            new Role("R002", "manager", "Manager", List.of("view_team_requests", "approve_request", "reject_request", "return_request")),
            new Role("R003", "senior_manager", "Senior Manager", List.of("view_dept_requests", "approve_request", "reject_request", "return_request", "escalate_request", "view_budget")),
            new Role("R004", "head", "Head", List.of("view_all_requests", "approve_request", "reject_request", "view_analytics", "view_budget")),
            new Role("R005", "procurement_officer", "Procurement Officer", List.of("manage_procurement", "create_po", "manage_suppliers", "compare_quotations")),
            new Role("R006", "equipment_team", "Equipment Team", List.of("manage_equipment", "verify_delivery", "create_grn", "handover")),
            new Role("R007", "software_team", "Software Team", List.of("manage_software", "check_licenses", "assign_license", "purchase_software")),
            new Role("R008", "facilities_team", "Facilities Team", List.of("manage_facilities", "coordinate_vendors", "verify_delivery", "handover")),
            new Role("R009", "finance_officer", "Finance Officer", List.of("verify_invoice", "process_payment", "view_payments")),
            new Role("R010", "admin", "Admin", List.of("manage_users", "manage_roles", "manage_departments", "manage_categories", "manage_suppliers", "manage_rules", "view_audit"))
        ));
    }

    /** Analytics series used by the dashboards. */
    public Map<String, Object> chartData() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("monthlyRequests", List.of(
            Map.of("month", "Jan", "requests", 18, "approved", 14, "rejected", 3),
            Map.of("month", "Feb", "requests", 24, "approved", 19, "rejected", 4),
            Map.of("month", "Mar", "requests", 32, "approved", 22, "rejected", 5),
            Map.of("month", "Apr", "requests", 28, "approved", 20, "rejected", 6),
            Map.of("month", "May", "requests", 35, "approved", 28, "rejected", 4),
            Map.of("month", "Jun", "requests", 22, "approved", 18, "rejected", 3)));
        data.put("categoryDistribution", List.of(
            Map.of("name", "Equipment & Assets", "value", 42, "fill", "#6366f1"),
            Map.of("name", "Software & Digital", "value", 35, "fill", "#06b6d4"),
            Map.of("name", "Facilities", "value", 23, "fill", "#10b981")));
        data.put("departmentSpending", List.of(
            Map.of("department", "Engineering", "spent", 3200000, "budget", 5000000),
            Map.of("department", "Marketing", "spent", 1800000, "budget", 3000000),
            Map.of("department", "HR", "spent", 900000, "budget", 2000000),
            Map.of("department", "Finance", "spent", 750000, "budget", 1500000),
            Map.of("department", "IT", "spent", 5600000, "budget", 8000000),
            Map.of("department", "Procurement", "spent", 1100000, "budget", 2000000),
            Map.of("department", "Facilities", "spent", 2400000, "budget", 4000000)));
        data.put("monthlySpending", List.of(
            Map.of("month", "Jan", "amount", 1250000),
            Map.of("month", "Feb", "amount", 1850000),
            Map.of("month", "Mar", "amount", 2100000),
            Map.of("month", "Apr", "amount", 1680000),
            Map.of("month", "May", "amount", 2450000),
            Map.of("month", "Jun", "amount", 1920000)));
        data.put("supplierPerformance", List.of(
            Map.of("name", "TechnoHub", "rating", 4.5, "orders", 28, "onTime", 92),
            Map.of("name", "SoftLicense", "rating", 4.2, "orders", 15, "onTime", 88),
            Map.of("name", "FurniCraft", "rating", 4.0, "orders", 12, "onTime", 85),
            Map.of("name", "CloudFirst", "rating", 4.8, "orders", 8, "onTime", 98),
            Map.of("name", "ElectroPro", "rating", 3.2, "orders", 5, "onTime", 65),
            Map.of("name", "InfraBuilders", "rating", 3.8, "orders", 6, "onTime", 78)));
        data.put("approvalMetrics", List.of(
            Map.of("month", "Jan", "avgDays", 3.2, "approvalRate", 78),
            Map.of("month", "Feb", "avgDays", 2.8, "approvalRate", 79),
            Map.of("month", "Mar", "avgDays", 2.5, "approvalRate", 82),
            Map.of("month", "Apr", "avgDays", 3.1, "approvalRate", 71),
            Map.of("month", "May", "avgDays", 2.2, "approvalRate", 80),
            Map.of("month", "Jun", "avgDays", 2.6, "approvalRate", 82)));
        data.put("paymentTrend", List.of(
            Map.of("month", "Jan", "paid", 850000, "pending", 320000),
            Map.of("month", "Feb", "paid", 1200000, "pending", 456000),
            Map.of("month", "Mar", "paid", 980000, "pending", 780000),
            Map.of("month", "Apr", "paid", 1500000, "pending", 560000),
            Map.of("month", "May", "paid", 1890000, "pending", 340000),
            Map.of("month", "Jun", "paid", 1650000, "pending", 420000)));
        return data;
    }

    /** Generates the next sequential id, e.g. nextId("REQ-2024-", requests.size()). */
    public static String nextId(String prefix, int count, int pad) {
        return prefix + String.format("%0" + pad + "d", count + 1);
    }
}
