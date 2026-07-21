USE procurement_system;

-- 1. Insert Departments
INSERT INTO departments (department_name, cost_center) VALUES
('IT Department', 'CC-IT-001'),
('HR Department', 'CC-HR-002'),
('Finance Department', 'CC-FIN-003'),
('Operations Department', 'CC-OPS-004'),
('Marketing Department', 'CC-MKT-005');

-- 2. Insert Users (role_ids: 1=Employee, 2=Manager, 3=Senior Manager, 4=Head, 5=Procurement Officer, 6=Finance Officer, 7=Admin)
INSERT INTO users (full_name, email, password_hash, role_id, department_id) VALUES
('John Doe', 'john.doe@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 1, 1),
('Jane Smith', 'jane.smith@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 1, 2),
('Bob Johnson', 'bob.johnson@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 2, 1),
('Alice Williams', 'alice.williams@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 2, 2),
('Charlie Brown', 'charlie.brown@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 3, 1),
('Sarah Connor', 'sarah.connor@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 4, 3),
('David Miller', 'david.miller@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 5, 4),
('Emily Davis', 'emily.davis@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 6, 3),
('Admin User', 'admin@company.com', '$2a$12$eImiTxAk4vmV.42.G2jE.O7ZJb6sC53XpW1G1s1m1e1r1y1s1i1d1', 7, 1);

-- 3. Insert Suppliers
INSERT INTO suppliers (supplier_name, email, phone, address, status, kyc_expiry, rating) VALUES
('TechCorp Solutions', 'sales@techcorp.com', '+1-555-0199', '100 Silicon Valley Way, CA', 'Active', '2027-12-31', 4.80),
('OfficeDepot Inc', 'support@officedepot.com', '+1-555-0122', '456 Business Road, NY', 'Active', '2026-09-15', 4.50),
('Apex Logistics', 'contracts@apexlogistics.com', '+1-555-0188', '789 Transport Drive, TX', 'Active', '2026-08-01', 4.20),
('Global Consulting', 'contact@globalconsulting.com', '+1-555-0177', '12 Wealth St, London, UK', 'Suspended', '2026-03-31', 3.50),
('CyberDyne Systems', 'defense@cyberdyne.co', '+1-555-0100', '800 Skynet Blvd, NM', 'Blacklisted', '2025-12-31', 1.20);

-- 4. Insert Budgets
INSERT INTO budgets (department_id, allocated_amount, actual_spend, committed_spend, fiscal_year) VALUES
(1, 800000.00, 320000.00, 180000.00, 'FY2026-27'), -- IT: 800k total, 320k actual, 180k committed, 300k available
(2, 250000.00, 110000.00, 40000.00, 'FY2026-27'),  -- HR: 250k total, 110k actual, 40k committed, 100k available
(3, 150000.00, 450000.00, 25000.00, 'FY2026-27'),  -- Finance
(4, 600000.00, 240000.00, 150000.00, 'FY2026-27'), -- Operations
(5, 300000.00, 195000.00, 65000.00, 'FY2026-27');  -- Marketing: 300k total, 195k actual, 65k committed (86.7% utilized)

-- 5. Insert Purchase Requests
INSERT INTO purchase_requests (employee_id, item_name, category, quantity, estimated_cost, reason, status, manager_decision, manager_comment, senior_manager_decision, senior_manager_comment, head_decision, head_comment, fulfillment_team) VALUES
(1, 'Enterprise Rack Servers Upgrade', 'IT Infrastructure', 3, 145000.00, 'Replace aging server hardware to support higher load for ERP applications.', 'Pending Head Approval', 'Approved', 'Critical replacement. Highly recommended.', 'Approved', 'Technical feasibility checked. Budget is available in IT.', 'Pending', NULL, 'IT Infrastructure Team'),
(2, 'Ergonomic Office Chairs & Desks', 'Office Equipment', 50, 22500.00, 'Ergonomic seating for the new floor employees to prevent workplace fatigue.', 'Approved', 'Approved', 'Reasonable cost, approved.', 'Approved', 'HR budget has capacity.', 'Approved', 'Approved. Good for employee health.', 'Facilities Management'),
(1, 'CyberSecurity Vulnerability Testing tool license', 'Software Licenses', 1, 48000.00, 'Essential penetration testing and automated scanning tool for monthly security compliance audits.', 'Pending Head Approval', 'Approved', 'Needed for SOC2 compliance.', 'Approved', 'Compliance requirement. Must procure.', 'Pending', NULL, 'InfoSec Operations'),
(2, 'Advanced Recruiting Platform subscription', 'Software Licenses', 1, 15000.00, 'AI-driven candidate sourcing platform to speed up hiring for tech roles.', 'Returned for Correction', 'Approved', 'Speeds up hiring process.', 'Returned', 'Please compare with LinkedIn Recruiter pricing first.', 'Pending', NULL, 'HR Talent Acquisition'),
(1, 'Office Supplies Restock', 'Office Equipment', 200, 4500.00, 'Monthly replenishment of printer ink, paper, files, and stationary items.', 'Approved', 'Approved', 'Standard monthly refill.', 'Approved', 'Approved.', 'Approved', 'Approved standard spend.', 'Facilities Management'),
(2, 'Corporate Brand Video Production', 'Marketing Services', 1, 65000.00, 'Production of a 3-minute corporate video for the annual stakeholder meeting and website homepage.', 'Pending Senior Manager Approval', 'Approved', 'Key branding event.', 'Pending', NULL, 'Pending', NULL, 'Brand Marketing'),
(1, 'DevOps Consulting Services', 'Consulting & Advisory', 1, 85000.00, 'Specialized consulting contract to implement Kubernetes cluster and CI/CD pipelines.', 'Hold', 'Approved', 'Important for product delivery.', 'Approved', 'Forwarded to Head.', 'Hold', 'On hold until next quarter review.', 'DevOps Platform Team'),
(1, 'Office Air Conditioning Repair', 'Maintenance', 4, 18000.00, 'Repairing faulty AC compressors in Block C before summer.', 'Pending Head Approval', 'Approved', 'Urgent maintenance required.', 'Approved', 'Approved.', 'Pending', NULL, 'Facilities Management');

-- 6. Insert Purchase Orders
INSERT INTO purchase_orders (request_id, po_number, supplier_id, total_amount, status) VALUES
(2, 'PO-2026-0001', 2, 22500.00, 'Issued'),
(5, 'PO-2026-0002', 2, 4500.00, 'Delivered');

-- 7. Insert Invoices
INSERT INTO invoices (po_id, invoice_number, amount, status, due_date) VALUES
(1, 'INV-2026-8801', 22500.00, 'Pending Payment', '2026-08-30'),
(2, 'INV-2026-8802', 4500.00, 'Paid', '2026-07-20');

-- 8. Insert Payments
INSERT INTO payments (invoice_id, amount, payment_date, payment_status) VALUES
(2, 4500.00, '2026-07-18 10:30:00', 'Completed');

-- 9. Insert Notifications
INSERT INTO notifications (message, type, is_read) VALUES
('Marketing Department budget utilization has reached 86.7% (Limit warning threshold: 80%).', 'Budget Warning', FALSE),
('High-value purchase request: "Enterprise Rack Servers Upgrade" ($145,000.00) is awaiting Head approval.', 'High-Value Request', FALSE),
('Supplier status alert: "CyberDyne Systems" has been blacklisted due to vendor compliance breach.', 'Supplier Issue', FALSE),
('Supplier KYC Expiry: "OfficeDepot Inc" compliance certificate will expire on 2026-09-15.', 'Compliance Alert', FALSE),
('Unusual spending spike: IT infrastructure category spend is 45% higher than the quarterly rolling average.', 'Unusual Spike', FALSE);
