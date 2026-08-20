// ============================================
// EPS Mock Data — Complete Procurement System
// ============================================

// ── Users ──
export const users = [
  { id: 'U001', name: 'Ravi Kumar', email: 'ravi@company.com', role: 'employee', department: 'Engineering', avatar: '#6366f1', phone: '9876543210', status: 'active', createdAt: '2024-01-15' },
  { id: 'U002', name: 'Priya Sharma', email: 'priya@company.com', role: 'employee', department: 'Marketing', avatar: '#ec4899', phone: '9876543211', status: 'active', createdAt: '2024-02-10' },
  { id: 'U003', name: 'Anand Mehta', email: 'anand@company.com', role: 'manager', department: 'Engineering', avatar: '#06b6d4', phone: '9876543212', status: 'active', createdAt: '2023-06-20' },
  { id: 'U004', name: 'Sunita Reddy', email: 'sunita@company.com', role: 'senior_manager', department: 'Engineering', avatar: '#f59e0b', phone: '9876543213', status: 'active', createdAt: '2023-03-15' },
  { id: 'U005', name: 'Vikram Singh', email: 'vikram@company.com', role: 'head', department: 'Corporate', avatar: '#10b981', phone: '9876543214', status: 'active', createdAt: '2022-01-10' },
  { id: 'U006', name: 'Deepa Nair', email: 'deepa@company.com', role: 'procurement_officer', department: 'Procurement', avatar: '#8b5cf6', phone: '9876543215', status: 'active', createdAt: '2023-08-01' },
  { id: 'U007', name: 'Rajesh Patel', email: 'rajesh@company.com', role: 'equipment_team', department: 'Procurement', avatar: '#14b8a6', phone: '9876543216', status: 'active', createdAt: '2023-09-12' },
  { id: 'U008', name: 'Kavita Joshi', email: 'kavita@company.com', role: 'software_team', department: 'IT', avatar: '#f472b6', phone: '9876543217', status: 'active', createdAt: '2023-07-05' },
  { id: 'U009', name: 'Arun Gupta', email: 'arun@company.com', role: 'facilities_team', department: 'Facilities', avatar: '#fbbf24', phone: '9876543218', status: 'active', createdAt: '2023-10-20' },
  { id: 'U010', name: 'Lakshmi Iyer', email: 'lakshmi@company.com', role: 'finance_officer', department: 'Finance', avatar: '#34d399', phone: '9876543219', status: 'active', createdAt: '2023-04-18' },
  { id: 'U011', name: 'Mohit Verma', email: 'mohit@company.com', role: 'admin', department: 'IT', avatar: '#ef4444', phone: '9876543220', status: 'active', createdAt: '2022-11-01' },
  { id: 'U012', name: 'Neha Kulkarni', email: 'neha@company.com', role: 'employee', department: 'HR', avatar: '#a78bfa', phone: '9876543221', status: 'active', createdAt: '2024-03-05' },
  { id: 'U013', name: 'Amit Shah', email: 'amit@technohub.in', role: 'supplier', department: 'External', avatar: '#f97316', phone: '9988776655', status: 'active', createdAt: '2023-01-10', supplierId: 'S001' },
  { id: 'U014', name: 'Neha Deshmukh', email: 'neha@softlicense.com', role: 'supplier', department: 'External', avatar: '#a855f7', phone: '9877665544', status: 'active', createdAt: '2023-03-20', supplierId: 'S002' },
  { id: 'U015', name: 'Ramesh Babu', email: 'orders@furnicraft.in', role: 'supplier', department: 'External', avatar: '#10b981', phone: '9766554433', status: 'active', createdAt: '2023-05-15', supplierId: 'S003' },
];

// ── Departments ──
export const departments = [
  { id: 'D001', name: 'Engineering', head: 'Sunita Reddy', budget: 5000000, budgetUsed: 3200000, employeeCount: 45, status: 'active' },
  { id: 'D002', name: 'Marketing', head: 'Anil Kapoor', budget: 3000000, budgetUsed: 1800000, employeeCount: 22, status: 'active' },
  { id: 'D003', name: 'HR', head: 'Meera Saxena', budget: 2000000, budgetUsed: 900000, employeeCount: 12, status: 'active' },
  { id: 'D004', name: 'Finance', head: 'Suresh Rajan', budget: 1500000, budgetUsed: 750000, employeeCount: 15, status: 'active' },
  { id: 'D005', name: 'IT', head: 'Mohit Verma', budget: 8000000, budgetUsed: 5600000, employeeCount: 35, status: 'active' },
  { id: 'D006', name: 'Procurement', head: 'Deepa Nair', budget: 2000000, budgetUsed: 1100000, employeeCount: 10, status: 'active' },
  { id: 'D007', name: 'Facilities', head: 'Arun Gupta', budget: 4000000, budgetUsed: 2400000, employeeCount: 18, status: 'active' },
  { id: 'D008', name: 'Corporate', head: 'Vikram Singh', budget: 10000000, budgetUsed: 6500000, employeeCount: 8, status: 'active' },
];

// ── Categories ──
export const categories = [
  { id: 'C001', name: 'Equipment & Assets', subcategories: ['Laptop', 'Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Headset', 'Webcam', 'Docking Station'], routeTo: 'equipment_team', icon: 'Monitor' },
  { id: 'C002', name: 'Software & Digital Services', subcategories: ['Software License', 'SaaS Subscription', 'API Service', 'AI Service', 'Cloud Service', 'Development Tool'], routeTo: 'software_team', icon: 'Code' },
  { id: 'C003', name: 'Facilities', subcategories: ['Furniture', 'Electrical Appliance', 'Office Equipment', 'Repairs', 'Renovation', 'Cleaning Supplies'], routeTo: 'facilities_team', icon: 'Building' },
];

// ── Requests ──
export const requests = [
  { id: 'REQ-2024-001', title: 'MacBook Pro 16 inch', description: 'Need a MacBook Pro for development work. Current laptop is 4 years old and causing productivity issues.', reason: 'Current laptop performance is degrading', category: 'Equipment & Assets', subcategory: 'Laptop', quantity: 1, estimatedCost: 189000, department: 'Engineering', requiredDate: '2024-04-15', status: 'approved', createdBy: 'U001', createdAt: '2024-03-01', updatedAt: '2024-03-05', priority: 'high' },
  { id: 'REQ-2024-002', title: 'Adobe Creative Cloud License', description: 'Annual subscription for design team', reason: 'Design team needs updated tools', category: 'Software & Digital Services', subcategory: 'Software License', quantity: 5, estimatedCost: 175000, department: 'Marketing', requiredDate: '2024-04-01', status: 'pending_senior_manager', createdBy: 'U002', createdAt: '2024-03-05', updatedAt: '2024-03-08', priority: 'medium' },
  { id: 'REQ-2024-003', title: 'Standing Desk', description: 'Ergonomic standing desk for better posture', reason: 'Health and ergonomics', category: 'Facilities', subcategory: 'Furniture', quantity: 3, estimatedCost: 45000, department: 'Engineering', requiredDate: '2024-04-20', status: 'pending_manager', createdBy: 'U001', createdAt: '2024-03-10', updatedAt: '2024-03-10', priority: 'low' },
  { id: 'REQ-2024-004', title: 'Dell UltraSharp 27" Monitor', description: '4K monitor for dual display setup', reason: 'Productivity improvement', category: 'Equipment & Assets', subcategory: 'Monitor', quantity: 2, estimatedCost: 72000, department: 'Engineering', requiredDate: '2024-04-10', status: 'pending_manager', createdBy: 'U012', createdAt: '2024-03-12', updatedAt: '2024-03-12', priority: 'medium' },
  { id: 'REQ-2024-005', title: 'Jira Software Cloud Premium', description: 'Project management tool upgrade', reason: 'Better project tracking needed', category: 'Software & Digital Services', subcategory: 'SaaS Subscription', quantity: 1, estimatedCost: 320000, department: 'IT', requiredDate: '2024-04-01', status: 'pending_head', createdBy: 'U001', createdAt: '2024-03-02', updatedAt: '2024-03-12', priority: 'high' },
  { id: 'REQ-2024-006', title: 'Office Chairs - Ergonomic', description: 'Replace old office chairs with ergonomic models', reason: 'Employee comfort and health', category: 'Facilities', subcategory: 'Furniture', quantity: 10, estimatedCost: 250000, department: 'HR', requiredDate: '2024-05-01', status: 'approved', createdBy: 'U012', createdAt: '2024-02-20', updatedAt: '2024-03-10', priority: 'medium' },
  { id: 'REQ-2024-007', title: 'GitHub Enterprise License', description: 'Enterprise license for the development team', reason: 'Security and compliance requirements', category: 'Software & Digital Services', subcategory: 'Software License', quantity: 1, estimatedCost: 480000, department: 'Engineering', requiredDate: '2024-04-15', status: 'in_procurement', createdBy: 'U001', createdAt: '2024-02-15', updatedAt: '2024-03-15', priority: 'high' },
  { id: 'REQ-2024-011', title: 'Standing Desk Converters', description: '12 adjustable standing desk converters for the design pod', reason: 'Ergonomics audit recommendation', category: 'Facilities', subcategory: 'Furniture', quantity: 12, estimatedCost: 180000, department: 'Design', requiredDate: '2024-06-10', status: 'approved', createdBy: 'U001', createdAt: '2024-03-18', updatedAt: '2024-03-22', priority: 'medium', procurementStage: 'finance_review', selectedQuotationId: null, selectedSupplierId: null, selectedSupplierName: null, poId: null },
  { id: 'REQ-2024-012', title: 'Conference Room AV Upgrade', description: '4K conference camera, ceiling mics and soundbar for Meeting Room 2', reason: 'Hybrid meeting quality issues', category: 'Equipment & Assets', subcategory: 'Office Equipment', quantity: 1, estimatedCost: 240000, department: 'IT', requiredDate: '2024-06-01', status: 'returned', createdBy: 'U001', createdAt: '2024-03-19', updatedAt: '2024-03-21', priority: 'high', returnComments: 'Please attach two comparative quotes and split the AV items line by line.', returnedBy: 'Anand Mehta', returnedByRole: 'manager', returnedAt: '2024-03-21T10:30:00', returnedFromStatus: 'pending_manager' },
  { id: 'REQ-2024-008', title: 'Wireless Keyboard & Mouse Set', description: 'Logitech MX Keys and MX Master 3S', reason: 'Old peripherals malfunctioning', category: 'Equipment & Assets', subcategory: 'Keyboard', quantity: 5, estimatedCost: 62500, department: 'Marketing', requiredDate: '2024-04-05', status: 'approved', createdBy: 'U002', createdAt: '2024-03-14', updatedAt: '2024-03-14', priority: 'low' },
  { id: 'REQ-2024-009', title: 'Conference Room Renovation', description: 'Renovation of main conference room including AV equipment', reason: 'Outdated facilities', category: 'Facilities', subcategory: 'Renovation', quantity: 1, estimatedCost: 850000, department: 'Facilities', requiredDate: '2024-06-01', status: 'approved', createdBy: 'U009', createdAt: '2024-01-20', updatedAt: '2024-03-01', priority: 'high' },
  { id: 'REQ-2024-010', title: 'AWS Cloud Credits', description: 'Cloud infrastructure credits for Q2', reason: 'Scaling production infrastructure', category: 'Software & Digital Services', subcategory: 'Cloud Service', quantity: 1, estimatedCost: 500000, department: 'Engineering', requiredDate: '2024-04-01', status: 'rejected', createdBy: 'U001', createdAt: '2024-02-28', updatedAt: '2024-03-08', priority: 'high' },
  { id: 'REQ-2024-013', title: 'Logitech Webcam C930e', description: 'HD webcam for video conferencing', reason: 'Remote meetings quality', category: 'Equipment & Assets', subcategory: 'Webcam', quantity: 8, estimatedCost: 56000, department: 'Engineering', requiredDate: '2024-04-10', status: 'delivered', createdBy: 'U001', createdAt: '2024-01-15', updatedAt: '2024-03-10', priority: 'medium' },
  { id: 'REQ-2024-014', title: 'Slack Enterprise Grid', description: 'Upgrade communication platform', reason: 'Enterprise security features needed', category: 'Software & Digital Services', subcategory: 'SaaS Subscription', quantity: 1, estimatedCost: 420000, department: 'IT', requiredDate: '2024-05-01', status: 'closed', createdBy: 'U001', createdAt: '2024-01-05', updatedAt: '2024-03-15', priority: 'high' },
];

// ── Approval History ──
export const approvalHistory = [
  { id: 'AH001', requestId: 'REQ-2024-001', approverName: 'Anand Mehta', approverRole: 'manager', action: 'approved', comments: 'Approved. Good justification for the upgrade.', timestamp: '2024-03-02T10:30:00' },
  { id: 'AH002', requestId: 'REQ-2024-001', approverName: 'Sunita Reddy', approverRole: 'senior_manager', action: 'approved', comments: 'Within budget. Approved.', timestamp: '2024-03-04T14:15:00' },
  { id: 'AH003', requestId: 'REQ-2024-001', approverName: 'Vikram Singh', approverRole: 'head', action: 'approved', comments: 'Final approval granted.', timestamp: '2024-03-05T09:00:00' },
  { id: 'AH004', requestId: 'REQ-2024-002', approverName: 'Anand Mehta', approverRole: 'manager', action: 'approved', comments: 'Design team definitely needs this.', timestamp: '2024-03-07T11:00:00' },
  { id: 'AH005', requestId: 'REQ-2024-005', approverName: 'Anand Mehta', approverRole: 'manager', action: 'approved', comments: 'Project management is critical. Approved.', timestamp: '2024-03-05T16:00:00' },
  { id: 'AH006', requestId: 'REQ-2024-005', approverName: 'Sunita Reddy', approverRole: 'senior_manager', action: 'approved', comments: 'Escalating to Head due to high value.', timestamp: '2024-03-10T09:30:00' },
  { id: 'AH007', requestId: 'REQ-2024-010', approverName: 'Anand Mehta', approverRole: 'manager', action: 'approved', comments: 'Infrastructure is important.', timestamp: '2024-03-03T10:00:00' },
  { id: 'AH008', requestId: 'REQ-2024-010', approverName: 'Sunita Reddy', approverRole: 'senior_manager', action: 'rejected', comments: 'Budget exceeded for this quarter. Re-submit next quarter.', timestamp: '2024-03-08T15:00:00' },
  { id: 'AH009', requestId: 'REQ-2024-006', approverName: 'Anand Mehta', approverRole: 'manager', action: 'approved', comments: 'Employee welfare. Approved.', timestamp: '2024-02-25T10:00:00' },
  { id: 'AH010', requestId: 'REQ-2024-006', approverName: 'Sunita Reddy', approverRole: 'senior_manager', action: 'approved', comments: 'Good for morale. Approved.', timestamp: '2024-03-01T11:00:00' },
  { id: 'AH011', requestId: 'REQ-2024-006', approverName: 'Vikram Singh', approverRole: 'head', action: 'approved', comments: 'Final approval.', timestamp: '2024-03-05T14:00:00' },
];

// ── Suppliers ──
export const suppliers = [
  { id: 'S001', companyName: 'TechnoHub India Pvt Ltd', businessType: 'IT Equipment Distributor', gstNumber: '29AABCT1234F1Z5', panNumber: 'AABCT1234F', bankName: 'HDFC Bank', accountNumber: '50200012345678', ifsc: 'HDFC0001234', contactPerson: 'Amit', phone: '9988776655', email: 'sales@technohub.in', address: '123, Electronic City, Bangalore - 560100', status: 'active', rating: 4.5, totalOrders: 28, createdAt: '2023-01-10' },
  { id: 'S002', companyName: 'SoftLicense Solutions', businessType: 'Software Reseller', gstNumber: '27BBCSL5678G2H6', panNumber: 'BBCSL5678G', bankName: 'ICICI Bank', accountNumber: '60300098765432', ifsc: 'ICIC0005678', contactPerson: 'Neha Deshmukh', phone: '9877665544', email: 'info@softlicense.com', address: '456, Baner Road, Pune - 411045', status: 'active', rating: 4.2, totalOrders: 15, createdAt: '2023-03-20' },
  { id: 'S003', companyName: 'FurniCraft Enterprises', businessType: 'Furniture Manufacturer', gstNumber: '36CCFCE9012H3I7', panNumber: 'CCFCE9012H', bankName: 'SBI', accountNumber: '40100056789012', ifsc: 'SBIN0009012', contactPerson: 'Ramesh Babu', phone: '9766554433', email: 'orders@furnicraft.in', address: '789, HITEC City, Hyderabad - 500081', status: 'active', rating: 4.0, totalOrders: 12, createdAt: '2023-05-15' },
  { id: 'S004', companyName: 'CloudFirst Technologies', businessType: 'Cloud Services Provider', gstNumber: '07DDCFT3456I4J8', panNumber: 'DDCFT3456I', bankName: 'Axis Bank', accountNumber: '70400034567890', ifsc: 'UTIB0003456', contactPerson: 'Sanjay Malhotra', phone: '9655443322', email: 'enterprise@cloudfirst.io', address: '321, Connaught Place, New Delhi - 110001', status: 'active', rating: 4.8, totalOrders: 8, createdAt: '2023-08-01' },
  { id: 'S005', companyName: 'ElectroPro Services', businessType: 'Electrical Contractor', gstNumber: '33EEPRS7890J5K9', panNumber: 'EEPRS7890J', bankName: 'Kotak Bank', accountNumber: '80500023456789', ifsc: 'KKBK0007890', contactPerson: 'Vijay Krishnan', phone: '9544332211', email: 'service@electropro.in', address: '654, Anna Nagar, Chennai - 600040', status: 'suspended', rating: 3.2, totalOrders: 5, createdAt: '2023-04-10' },
  { id: 'S006', companyName: 'InfraBuilders Co', businessType: 'Construction & Renovation', gstNumber: '29IIBCO2345K6L0', panNumber: 'IIBCO2345K', bankName: 'Yes Bank', accountNumber: '90600012345678', ifsc: 'YESB0002345', contactPerson: 'Prakash Shetty', phone: '9433221100', email: 'projects@infrabuilders.in', address: '987, Koramangala, Bangalore - 560034', status: 'active', rating: 3.8, totalOrders: 6, createdAt: '2023-09-25' },
];

// ── Purchase Orders ──
export const purchaseOrders = [
  { id: 'PO-2024-001', requestId: 'REQ-2024-001', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', items: [{ name: 'MacBook Pro 16" M3 Pro', quantity: 1, unitPrice: 185000, total: 185000 }], subtotal: 185000, tax: 33300, totalAmount: 218300, deliveryDate: '2024-04-10', status: 'delivered', createdAt: '2024-03-06', createdBy: 'U006' },
  { id: 'PO-2024-002', requestId: 'REQ-2024-006', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', items: [{ name: 'Ergonomic Office Chair - Herman Miller Clone', quantity: 10, unitPrice: 22000, total: 220000 }], subtotal: 220000, tax: 39600, totalAmount: 259600, deliveryDate: '2024-04-25', status: 'accepted', createdAt: '2024-03-12', createdBy: 'U006' },
  { id: 'PO-2024-003', requestId: 'REQ-2024-007', supplierId: 'S002', supplierName: 'SoftLicense Solutions', items: [{ name: 'GitHub Enterprise Server - Annual License', quantity: 1, unitPrice: 450000, total: 450000 }], subtotal: 450000, tax: 81000, totalAmount: 531000, deliveryDate: '2024-04-01', status: 'sent', createdAt: '2024-03-16', createdBy: 'U006' },
  { id: 'PO-2024-004', requestId: 'REQ-2024-009', supplierId: 'S006', supplierName: 'InfraBuilders Co', items: [{ name: 'Conference Room Full Renovation', quantity: 1, unitPrice: 750000, total: 750000 }, { name: 'AV Equipment Installation', quantity: 1, unitPrice: 85000, total: 85000 }], subtotal: 835000, tax: 150300, totalAmount: 985300, deliveryDate: '2024-05-15', status: 'accepted', createdAt: '2024-03-05', createdBy: 'U006' },
  { id: 'PO-2024-005', requestId: 'REQ-2024-013', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', items: [{ name: 'Logitech C930e Webcam', quantity: 8, unitPrice: 6500, total: 52000 }], subtotal: 52000, tax: 9360, totalAmount: 61360, deliveryDate: '2024-03-05', status: 'closed', createdAt: '2024-02-01', createdBy: 'U006' },
  { id: 'PO-2024-006', requestId: 'REQ-2024-014', supplierId: 'S002', supplierName: 'SoftLicense Solutions', items: [{ name: 'Slack Enterprise Grid - Annual', quantity: 1, unitPrice: 400000, total: 400000 }], subtotal: 400000, tax: 72000, totalAmount: 472000, deliveryDate: '2024-02-15', status: 'closed', createdAt: '2024-01-10', createdBy: 'U006' },
];

// ── Goods Receipt Notes ──
export const goodsReceiptNotes = [
  { id: 'GRN-2024-001', poNumber: 'PO-2024-001', items: [{ name: 'MacBook Pro 16" M3 Pro', orderedQty: 1, receivedQty: 1, qualityCheck: 'passed' }], receivedDate: '2024-04-08', verifiedBy: 'U007', handoverTo: 'U001', handoverConfirmed: true, remarks: 'All items in perfect condition', status: 'completed' },
  { id: 'GRN-2024-002', poNumber: 'PO-2024-005', items: [{ name: 'Logitech C930e Webcam', orderedQty: 8, receivedQty: 8, qualityCheck: 'passed' }], receivedDate: '2024-03-04', verifiedBy: 'U007', handoverTo: 'U001', handoverConfirmed: true, remarks: 'All webcams tested and working', status: 'completed' },
];

// ── Software Licenses ──
export const softwareLicenses = [
  { id: 'LIC-001', name: 'GitHub Enterprise', vendor: 'GitHub / Microsoft', licenseKey: 'GH-ENT-XXXX-YYYY', totalSeats: 50, usedSeats: 42, expiryDate: '2025-04-15', status: 'active', annualCost: 450000, assignedTo: ['U001', 'U002', 'U012'] },
  { id: 'LIC-002', name: 'Slack Enterprise Grid', vendor: 'Slack / Salesforce', licenseKey: 'SLK-GRID-XXXX', totalSeats: 200, usedSeats: 156, expiryDate: '2025-02-15', status: 'active', annualCost: 400000, assignedTo: [] },
  { id: 'LIC-003', name: 'Adobe Creative Cloud', vendor: 'Adobe Inc', licenseKey: 'ADO-CC-XXXX', totalSeats: 10, usedSeats: 8, expiryDate: '2024-12-31', status: 'active', annualCost: 175000, assignedTo: ['U002'] },
  { id: 'LIC-004', name: 'Jira Software Cloud', vendor: 'Atlassian', licenseKey: 'JIRA-CLD-XXXX', totalSeats: 100, usedSeats: 67, expiryDate: '2024-09-30', status: 'active', annualCost: 280000, assignedTo: [] },
  { id: 'LIC-005', name: 'Microsoft 365 E5', vendor: 'Microsoft', licenseKey: 'M365-E5-XXXX', totalSeats: 250, usedSeats: 210, expiryDate: '2025-06-30', status: 'active', annualCost: 800000, assignedTo: [] },
];

// ── Payments ──
export const payments = [
  { id: 'PAY-2024-001', poId: 'PO-2024-005', poNumber: 'PO-2024-005', supplierId: 'SUP001', supplierName: 'TechnoHub India Pvt Ltd', invoiceNumber: 'INV-001', amount: 61360, paymentMethod: 'NEFT', referenceNumber: 'NEFT-20240310-001', status: 'paid', paidDate: '2024-03-10', verifiedBy: 'U010', transactionId: 'TXN-HDFC-20240310-001' },
  { id: 'PAY-2024-002', poId: 'PO-2024-006', poNumber: 'PO-2024-006', supplierId: 'SUP004', supplierName: 'SoftLicense Solutions', invoiceNumber: 'INV-002', amount: 472000, paymentMethod: 'RTGS', referenceNumber: 'RTGS-20240220-001', status: 'paid', paidDate: '2024-02-20', verifiedBy: 'U010', transactionId: 'TXN-HDFC-20240220-001' },
  { id: 'PAY-2024-003', poId: 'PO-2024-001', poNumber: 'PO-2024-001', supplierId: 'SUP001', supplierName: 'TechnoHub India Pvt Ltd', invoiceNumber: 'INV-003', amount: 218300, paymentMethod: 'NEFT', referenceNumber: 'NEFT-20240415-001', status: 'processing', paidDate: null, verifiedBy: 'U010', transactionId: null },
  { id: 'PAY-2024-004', poId: 'PO-2024-002', poNumber: 'PO-2024-002', supplierId: 'SUP002', supplierName: 'FurniCraft Enterprises', invoiceNumber: 'INV-004', amount: 259600, paymentMethod: 'NEFT', referenceNumber: null, status: 'pending', paidDate: null, verifiedBy: null, transactionId: null },
  { id: 'PAY-2024-005', poId: 'PO-2024-004', poNumber: 'PO-2024-004', supplierId: 'SUP005', supplierName: 'InfraBuilders Co', invoiceNumber: 'INV-005', amount: 985300, paymentMethod: 'RTGS', referenceNumber: null, status: 'pending', paidDate: null, verifiedBy: null, transactionId: null },
];

// ── Notifications ──
export const notifications = [
  { id: 'N001', userId: 'U001', type: 'request_approved', title: 'Request Approved', message: 'Your request REQ-2024-001 (MacBook Pro) has been fully approved.', read: false, createdAt: '2024-03-05T09:05:00', link: '/requests/REQ-2024-001' },
  { id: 'N002', userId: 'U001', type: 'po_created', title: 'Purchase Order Created', message: 'PO-2024-001 has been created for your MacBook Pro request.', read: false, createdAt: '2024-03-06T11:00:00', link: '/purchase-orders/PO-2024-001' },
  { id: 'N003', userId: 'U001', type: 'delivery_completed', title: 'Delivery Completed', message: 'Your MacBook Pro has been delivered. Please confirm handover.', read: true, createdAt: '2024-04-08T15:00:00', link: '/requests/REQ-2024-001' },
  { id: 'N004', userId: 'U003', type: 'pending_approval', title: 'New Approval Request', message: 'REQ-2024-003 from Ravi Kumar requires your approval.', read: false, createdAt: '2024-03-10T10:00:00', link: '/approvals' },
  { id: 'N005', userId: 'U003', type: 'pending_approval', title: 'New Approval Request', message: 'REQ-2024-004 from Neha Kulkarni requires your approval.', read: false, createdAt: '2024-03-12T09:30:00', link: '/approvals' },
  { id: 'N006', userId: 'U006', type: 'request_approved', title: 'Request Ready for Procurement', message: 'REQ-2024-007 has been approved and is ready for procurement.', read: true, createdAt: '2024-03-15T10:00:00', link: '/procurement' },
  { id: 'N007', userId: 'U010', type: 'invoice_pending', title: 'Invoice Pending Verification', message: 'Invoice for PO-2024-001 is pending your verification.', read: false, createdAt: '2024-04-10T08:00:00', link: '/finance/invoices' },
  { id: 'N008', userId: 'U001', type: 'request_rejected', title: 'Request Rejected', message: 'Your request REQ-2024-010 (AWS Cloud Credits) has been rejected.', read: true, createdAt: '2024-03-08T15:30:00', link: '/requests/REQ-2024-010' },
];

// ── RFQs ──
export const rfqs = [
  { id: 'RFQ-2024-001', rfqNumber: 'RFQ-2024-001', requestId: 'REQ-2024-004', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', itemName: 'Dell UltraSharp 27" Monitor', quantity: 2, requiredDeliveryDate: '2024-04-20', deliveryLocation: 'Bangalore Office - Floor 3', submissionDeadline: '2024-04-05', category: 'Equipment & Assets', productAvailability: 'Available', status: 'pending', declineReason: null, declineRemarks: null, createdAt: '2024-03-20' },
  { id: 'RFQ-2024-002', rfqNumber: 'RFQ-2024-002', requestId: 'REQ-2024-006', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', itemName: 'Standing Executive Desk', quantity: 3, requiredDeliveryDate: '2024-05-01', deliveryLocation: 'Bangalore Office - Floor 2', submissionDeadline: '2024-04-10', category: 'Facilities', productAvailability: 'Available', status: 'pending', declineReason: null, declineRemarks: null, createdAt: '2024-03-22' },
  { id: 'RFQ-2024-005', rfqNumber: 'RFQ-2024-005', requestId: 'REQ-2024-011', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', itemName: 'Standing Desk Converters', quantity: 12, requiredDeliveryDate: '2024-06-10', deliveryLocation: 'Bangalore Office', submissionDeadline: '2024-04-20', category: 'Facilities', productAvailability: 'Available', status: 'quoted', declineReason: null, declineRemarks: null, createdAt: '2024-03-20' },
  { id: 'RFQ-2024-006', rfqNumber: 'RFQ-2024-006', requestId: 'REQ-2024-011', supplierId: 'S006', supplierName: 'InfraBuilders Co', itemName: 'Standing Desk Converters', quantity: 12, requiredDeliveryDate: '2024-06-10', deliveryLocation: 'Bangalore Office', submissionDeadline: '2024-04-20', category: 'Facilities', productAvailability: 'Available', status: 'quoted', declineReason: null, declineRemarks: null, createdAt: '2024-03-20' },
  { id: 'RFQ-2024-003', rfqNumber: 'RFQ-2024-003', requestId: 'REQ-2024-008', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', itemName: 'Wireless Keyboard & Mouse Set', quantity: 5, requiredDeliveryDate: '2024-04-15', deliveryLocation: 'Pune Tech Park', submissionDeadline: '2024-04-02', category: 'Equipment & Assets', productAvailability: 'Available', status: 'quoted', declineReason: null, declineRemarks: null, createdAt: '2024-03-18' },
  { id: 'RFQ-2024-004', rfqNumber: 'RFQ-2024-004', requestId: 'REQ-2024-009', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', itemName: 'Ergonomic Mesh Chair', quantity: 10, requiredDeliveryDate: '2024-05-10', deliveryLocation: 'Hyderabad Tech Campus', submissionDeadline: '2024-04-15', category: 'Facilities', productAvailability: 'Out of Stock', status: 'declined', declineReason: 'Out of Stock', declineRemarks: 'Item currently on backorder for 60 days', createdAt: '2024-03-21' },
];

// ── Quotations ──
export const quotations = [
  { id: 'Q005', rfqId: 'RFQ-2024-005', requestId: 'REQ-2024-011', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', unitPrice: 13500, items: [{ name: 'Standing Desk Converter', unitPrice: 13500, quantity: 12 }], totalAmount: 162000, estimatedDeliveryTime: '12 Days', warranty: '3 Years Frame Warranty', remarks: 'Installation included at no extra cost', validUntil: '2024-05-20', status: 'pending_finance', financeStatus: 'pending_finance', financeComments: null, financeReviewedBy: null, financeReviewedAt: null, selected: false, submittedAt: '2024-03-22T09:15:00' },
  { id: 'Q006', rfqId: 'RFQ-2024-006', requestId: 'REQ-2024-011', supplierId: 'S006', supplierName: 'InfraBuilders Co', unitPrice: 14900, items: [{ name: 'Standing Desk Converter', unitPrice: 14900, quantity: 12 }], totalAmount: 178800, estimatedDeliveryTime: '8 Days', warranty: '2 Years Warranty', remarks: 'Faster delivery, installation billed separately', validUntil: '2024-05-20', status: 'pending_finance', financeStatus: 'pending_finance', financeComments: null, financeReviewedBy: null, financeReviewedAt: null, selected: false, submittedAt: '2024-03-22T11:40:00' },
  { id: 'Q001', rfqId: 'RFQ-2024-003', requestId: 'REQ-2024-008', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', unitPrice: 12500, items: [{ name: 'Wireless Keyboard & Mouse Set', unitPrice: 12500, quantity: 5 }], totalAmount: 62500, estimatedDeliveryTime: '5 Days', warranty: '1 Year Onsite Warranty', remarks: 'Includes express courier shipping', validUntil: '2024-04-30', status: 'pending_finance', financeStatus: 'pending_finance', financeComments: null, financeReviewedBy: null, financeReviewedAt: null, selected: false, submittedAt: '2024-03-19' },
  { id: 'Q002', rfqId: 'RFQ-2024-001', requestId: 'REQ-2024-001', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', unitPrice: 185000, items: [{ name: 'MacBook Pro 16" M3 Pro', unitPrice: 185000, quantity: 1 }], totalAmount: 185000, estimatedDeliveryTime: '7 Days', warranty: '1 Year AppleCare Warranty', remarks: 'Official Apple authorized distributor', validUntil: '2024-04-30', status: 'accepted', financeStatus: 'approved', financeComments: 'Rates within budget. Cleared for award.', financeReviewedBy: 'Lakshmi Iyer', financeReviewedAt: null, selected: true, submittedAt: '2024-03-04' },
  { id: 'Q003', rfqId: 'RFQ-2024-002', requestId: 'REQ-2024-006', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', unitPrice: 22000, items: [{ name: 'Ergonomic Office Chair', unitPrice: 22000, quantity: 10 }], totalAmount: 220000, estimatedDeliveryTime: '10 Days', warranty: '2 Years Replacement Warranty', remarks: 'Custom lumbar support cushion included', validUntil: '2024-05-15', status: 'accepted', financeStatus: 'approved', financeComments: 'Best value among received quotations.', financeReviewedBy: 'Lakshmi Iyer', financeReviewedAt: null, selected: true, submittedAt: '2024-03-10' },
  { id: 'Q004', rfqId: 'RFQ-2024-004', requestId: 'REQ-2024-006', supplierId: 'S006', supplierName: 'InfraBuilders Co', unitPrice: 25000, items: [{ name: 'Ergonomic Office Chair', unitPrice: 25000, quantity: 10 }], totalAmount: 250000, estimatedDeliveryTime: '15 Days', warranty: '1 Year Warranty', remarks: 'Standard delivery', validUntil: '2024-05-15', status: 'rejected', financeStatus: 'rejected', financeComments: 'Quoted 13% above the approved estimate.', financeReviewedBy: 'Lakshmi Iyer', financeReviewedAt: null, selected: false, submittedAt: '2024-03-10' },
];

// ── Audit Logs ──
export const auditLogs = [
  { id: 'AL001', userId: 'U001', userName: 'Ravi Kumar', role: 'employee', action: 'CREATE_REQUEST', entity: 'Request', entityId: 'REQ-2024-001', previousValue: null, updatedValue: 'Draft created', ipAddress: '192.168.1.100', timestamp: '2024-03-01T09:00:00', remarks: 'New procurement request created' },
  { id: 'AL002', userId: 'U001', userName: 'Ravi Kumar', role: 'employee', action: 'SUBMIT_REQUEST', entity: 'Request', entityId: 'REQ-2024-001', previousValue: 'draft', updatedValue: 'pending_manager', ipAddress: '192.168.1.100', timestamp: '2024-03-01T09:15:00', remarks: 'Request submitted for approval' },
  { id: 'AL003', userId: 'U003', userName: 'Anand Mehta', role: 'manager', action: 'APPROVE_REQUEST', entity: 'Request', entityId: 'REQ-2024-001', previousValue: 'pending_manager', updatedValue: 'pending_senior_manager', ipAddress: '192.168.1.105', timestamp: '2024-03-02T10:30:00', remarks: 'Manager approved. Forwarded to Senior Manager.' },
  { id: 'AL004', userId: 'U004', userName: 'Sunita Reddy', role: 'senior_manager', action: 'APPROVE_REQUEST', entity: 'Request', entityId: 'REQ-2024-001', previousValue: 'pending_senior_manager', updatedValue: 'pending_head', ipAddress: '192.168.1.110', timestamp: '2024-03-04T14:15:00', remarks: 'Senior Manager approved. Escalated to Head.' },
  { id: 'AL005', userId: 'U005', userName: 'Vikram Singh', role: 'head', action: 'APPROVE_REQUEST', entity: 'Request', entityId: 'REQ-2024-001', previousValue: 'pending_head', updatedValue: 'approved', ipAddress: '192.168.1.115', timestamp: '2024-03-05T09:00:00', remarks: 'Head gave final approval.' },
  { id: 'AL006', userId: 'U006', userName: 'Deepa Nair', role: 'procurement_officer', action: 'CREATE_PO', entity: 'PurchaseOrder', entityId: 'PO-2024-001', previousValue: null, updatedValue: 'PO Created', ipAddress: '192.168.1.120', timestamp: '2024-03-06T11:00:00', remarks: 'Purchase Order created for MacBook Pro.' },
  { id: 'AL007', userId: 'U011', userName: 'Mohit Verma', role: 'admin', action: 'UPDATE_USER', entity: 'User', entityId: 'U005', previousValue: '{"role":"senior_manager"}', updatedValue: '{"role":"head"}', ipAddress: '192.168.1.130', timestamp: '2024-01-10T08:00:00', remarks: 'Promoted Vikram Singh to Head role.' },
  { id: 'AL008', userId: 'U010', userName: 'Lakshmi Iyer', role: 'finance_officer', action: 'PROCESS_PAYMENT', entity: 'Payment', entityId: 'PAY-2024-001', previousValue: 'pending', updatedValue: 'paid', ipAddress: '192.168.1.125', timestamp: '2024-03-10T14:00:00', remarks: 'Payment processed via NEFT.' },
  { id: 'AL009', userId: 'U004', userName: 'Sunita Reddy', role: 'senior_manager', action: 'REJECT_REQUEST', entity: 'Request', entityId: 'REQ-2024-010', previousValue: 'pending_senior_manager', updatedValue: 'rejected', ipAddress: '192.168.1.110', timestamp: '2024-03-08T15:00:00', remarks: 'Budget exceeded for this quarter.' },
  { id: 'AL010', userId: 'U011', userName: 'Mohit Verma', role: 'admin', action: 'CREATE_SUPPLIER', entity: 'Supplier', entityId: 'S001', previousValue: null, updatedValue: 'Supplier created', ipAddress: '192.168.1.130', timestamp: '2023-01-10T10:00:00', remarks: 'New supplier TechnoHub India added.' },
];

// ── Approval Rules ──
export const approvalRules = [
  { id: 'AR001', minAmount: 0, maxAmount: 50000, levels: ['manager'], description: 'Low value: Manager approval only' },
  { id: 'AR002', minAmount: 50001, maxAmount: 200000, levels: ['manager', 'senior_manager'], description: 'Medium value: Manager + Senior Manager' },
  { id: 'AR003', minAmount: 200001, maxAmount: Infinity, levels: ['manager', 'senior_manager', 'head'], description: 'High value: Manager + Senior Manager + Head' },
];

// ── Roles ──
export const roles = [
  { id: 'R001', name: 'employee', displayName: 'Employee', permissions: ['create_request', 'view_own_requests', 'edit_draft', 'cancel_request'] },
  { id: 'R002', name: 'manager', displayName: 'Manager', permissions: ['view_team_requests', 'approve_request', 'reject_request', 'return_request'] },
  { id: 'R003', name: 'senior_manager', displayName: 'Senior Manager', permissions: ['view_dept_requests', 'approve_request', 'reject_request', 'return_request', 'escalate_request', 'view_budget'] },
  { id: 'R004', name: 'head', displayName: 'Head', permissions: ['view_all_requests', 'approve_request', 'reject_request', 'view_analytics', 'view_budget'] },
  { id: 'R005', name: 'procurement_officer', displayName: 'Procurement Officer', permissions: ['manage_procurement', 'create_po', 'manage_suppliers', 'compare_quotations'] },
  { id: 'R006', name: 'equipment_team', displayName: 'Equipment Team', permissions: ['manage_equipment', 'verify_delivery', 'create_grn', 'handover'] },
  { id: 'R007', name: 'software_team', displayName: 'Software Team', permissions: ['manage_software', 'check_licenses', 'assign_license', 'purchase_software'] },
  { id: 'R008', name: 'facilities_team', displayName: 'Facilities Team', permissions: ['manage_facilities', 'coordinate_vendors', 'verify_delivery', 'handover'] },
  { id: 'R009', name: 'finance_officer', displayName: 'Finance Officer', permissions: ['verify_invoice', 'process_payment', 'view_payments'] },
  { id: 'R010', name: 'admin', displayName: 'Admin', permissions: ['manage_users', 'manage_roles', 'manage_departments', 'manage_categories', 'manage_suppliers', 'manage_rules', 'view_audit'] },
  { id: 'R011', name: 'supplier', displayName: 'Supplier', permissions: ['view_tenders', 'submit_bid', 'view_own_bids', 'view_own_orders'] },
];

// ── Dashboard Chart Data ──
export const chartData = {
  monthlyRequests: [
    { month: 'Jan', requests: 18, approved: 14, rejected: 3 },
    { month: 'Feb', requests: 24, approved: 19, rejected: 4 },
    { month: 'Mar', requests: 32, approved: 22, rejected: 5 },
    { month: 'Apr', requests: 28, approved: 20, rejected: 6 },
    { month: 'May', requests: 35, approved: 28, rejected: 4 },
    { month: 'Jun', requests: 22, approved: 18, rejected: 3 },
  ],
  categoryDistribution: [
    { name: 'Equipment & Assets', value: 42, fill: '#6366f1' },
    { name: 'Software & Digital', value: 35, fill: '#06b6d4' },
    { name: 'Facilities', value: 23, fill: '#10b981' },
  ],
  departmentSpending: [
    { department: 'Engineering', spent: 3200000, budget: 5000000 },
    { department: 'Marketing', spent: 1800000, budget: 3000000 },
    { department: 'HR', spent: 900000, budget: 2000000 },
    { department: 'Finance', spent: 750000, budget: 1500000 },
    { department: 'IT', spent: 5600000, budget: 8000000 },
    { department: 'Procurement', spent: 1100000, budget: 2000000 },
    { department: 'Facilities', spent: 2400000, budget: 4000000 },
  ],
  monthlySpending: [
    { month: 'Jan', amount: 1250000 },
    { month: 'Feb', amount: 1850000 },
    { month: 'Mar', amount: 2100000 },
    { month: 'Apr', amount: 1680000 },
    { month: 'May', amount: 2450000 },
    { month: 'Jun', amount: 1920000 },
  ],
  supplierPerformance: [
    { name: 'TechnoHub', rating: 4.5, orders: 28, onTime: 92 },
    { name: 'SoftLicense', rating: 4.2, orders: 15, onTime: 88 },
    { name: 'FurniCraft', rating: 4.0, orders: 12, onTime: 85 },
    { name: 'CloudFirst', rating: 4.8, orders: 8, onTime: 98 },
    { name: 'ElectroPro', rating: 3.2, orders: 5, onTime: 65 },
    { name: 'InfraBuilders', rating: 3.8, orders: 6, onTime: 78 },
  ],
  approvalMetrics: [
    { month: 'Jan', avgDays: 3.2, approvalRate: 78 },
    { month: 'Feb', avgDays: 2.8, approvalRate: 79 },
    { month: 'Mar', avgDays: 2.5, approvalRate: 82 },
    { month: 'Apr', avgDays: 3.1, approvalRate: 71 },
    { month: 'May', avgDays: 2.2, approvalRate: 80 },
    { month: 'Jun', avgDays: 2.6, approvalRate: 82 },
  ],
  paymentTrend: [
    { month: 'Jan', paid: 850000, pending: 320000 },
    { month: 'Feb', paid: 1200000, pending: 456000 },
    { month: 'Mar', paid: 980000, pending: 780000 },
    { month: 'Apr', paid: 1500000, pending: 560000 },
    { month: 'May', paid: 1890000, pending: 340000 },
    { month: 'Jun', paid: 1650000, pending: 420000 },
  ],
};

// ── Tenders ──
export const tenders = [
  {
    id: 'TND-2024-001',
    requestId: 'REQ-2024-001',
    title: 'Supply of MacBook Pro 16 inch Laptops',
    description: 'Procurement of Apple MacBook Pro 16 inch M3 Pro laptops for the Engineering department. Must include 36GB RAM and 512GB SSD configuration.',
    category: 'Equipment & Assets',
    specifications: 'Apple MacBook Pro 16", M3 Pro chip, 36GB RAM, 512GB SSD, Space Black. Must include Apple warranty and original accessories.',
    quantity: 1,
    estimatedBudget: 189000,
    deadline: '2024-04-01T23:59:59',
    status: 'awarded',
    invitedSuppliers: ['S001', 'S004'],
    awardedBidId: 'BID-001',
    awardedSupplierId: 'S001',
    createdBy: 'U006',
    createdAt: '2024-03-06T10:00:00',
    publishedAt: '2024-03-06T11:00:00',
    closedAt: '2024-03-20T23:59:59',
  },
  {
    id: 'TND-2024-002',
    requestId: 'REQ-2024-006',
    title: 'Supply of Ergonomic Office Chairs',
    description: 'Procurement of 10 ergonomic office chairs for the HR department. Chairs should support adjustable height, lumbar support, and armrests.',
    category: 'Facilities',
    specifications: 'Ergonomic office chair with mesh back, adjustable lumbar support, 4D armrests, height adjustable, 120kg weight capacity, 3-year warranty.',
    quantity: 10,
    estimatedBudget: 250000,
    deadline: '2024-04-15T23:59:59',
    status: 'awarded',
    invitedSuppliers: ['S003', 'S006'],
    awardedBidId: 'BID-003',
    awardedSupplierId: 'S003',
    createdBy: 'U006',
    createdAt: '2024-03-10T09:00:00',
    publishedAt: '2024-03-10T10:00:00',
    closedAt: '2024-03-28T23:59:59',
  },
  {
    id: 'TND-2024-003',
    requestId: 'REQ-2024-009',
    title: 'Conference Room Renovation & AV Installation',
    description: 'Complete renovation of the main conference room including AV equipment, acoustic panels, smart lighting, and modern furniture.',
    category: 'Facilities',
    specifications: 'Full room renovation (approx 500 sq ft), 85" 4K display, ceiling-mounted projector, 12-seat conference table, acoustic panels, Zoom-ready AV system.',
    quantity: 1,
    estimatedBudget: 850000,
    deadline: '2024-04-30T23:59:59',
    status: 'evaluation',
    invitedSuppliers: ['S003', 'S005', 'S006'],
    awardedBidId: null,
    awardedSupplierId: null,
    createdBy: 'U006',
    createdAt: '2024-03-02T14:00:00',
    publishedAt: '2024-03-03T09:00:00',
    closedAt: '2024-04-15T23:59:59',
  },
  {
    id: 'TND-2024-004',
    requestId: 'REQ-2024-007',
    title: 'GitHub Enterprise Server Annual License',
    description: 'Annual enterprise license for GitHub Enterprise Server for the entire Engineering department. Need self-hosted option with SSO integration.',
    category: 'Software & Digital Services',
    specifications: 'GitHub Enterprise Server license, 50+ seats, self-hosted, SAML SSO support, 24/7 premium support, data residency in India preferred.',
    quantity: 1,
    estimatedBudget: 480000,
    deadline: '2024-04-10T23:59:59',
    status: 'open',
    invitedSuppliers: ['S002', 'S004'],
    awardedBidId: null,
    awardedSupplierId: null,
    createdBy: 'U006',
    createdAt: '2024-03-16T11:00:00',
    publishedAt: '2024-03-16T12:00:00',
    closedAt: null,
  },
];

// ── Tender Bids ──
export const tenderBids = [
  {
    id: 'BID-001',
    tenderId: 'TND-2024-001',
    supplierId: 'S001',
    supplierName: 'TechnoHub India Pvt Ltd',
    items: [{ name: 'MacBook Pro 16" M3 Pro 36GB/512GB', unitPrice: 185000, quantity: 1, total: 185000 }],
    totalAmount: 185000,
    deliveryDays: 7,
    validUntil: '2024-05-01',
    terms: 'Delivery within 7 working days. 1-year Apple warranty included. Free setup and data migration.',
    status: 'accepted',
    submittedAt: '2024-03-10T14:00:00',
    updatedAt: '2024-03-20T10:00:00',
  },
  {
    id: 'BID-002',
    tenderId: 'TND-2024-001',
    supplierId: 'S004',
    supplierName: 'CloudFirst Technologies',
    items: [{ name: 'MacBook Pro 16" M3 Pro 36GB/512GB', unitPrice: 192000, quantity: 1, total: 192000 }],
    totalAmount: 192000,
    deliveryDays: 10,
    validUntil: '2024-05-01',
    terms: 'Delivery within 10 working days. Apple warranty + 1 year extended warranty.',
    status: 'rejected',
    submittedAt: '2024-03-12T09:00:00',
    updatedAt: '2024-03-20T10:00:00',
  },
  {
    id: 'BID-003',
    tenderId: 'TND-2024-002',
    supplierId: 'S003',
    supplierName: 'FurniCraft Enterprises',
    items: [{ name: 'ErgoMax Pro Office Chair', unitPrice: 22000, quantity: 10, total: 220000 }],
    totalAmount: 220000,
    deliveryDays: 14,
    validUntil: '2024-05-15',
    terms: 'Free delivery and assembly. 3-year warranty on frame, 1-year on upholstery.',
    status: 'accepted',
    submittedAt: '2024-03-14T11:00:00',
    updatedAt: '2024-03-28T15:00:00',
  },
  {
    id: 'BID-004',
    tenderId: 'TND-2024-002',
    supplierId: 'S006',
    supplierName: 'InfraBuilders Co',
    items: [{ name: 'Premium Ergonomic Chair', unitPrice: 25000, quantity: 10, total: 250000 }],
    totalAmount: 250000,
    deliveryDays: 21,
    validUntil: '2024-05-15',
    terms: 'Delivery in 3 weeks. 2-year warranty. Installation charges extra (₹500/chair).',
    status: 'rejected',
    submittedAt: '2024-03-15T16:00:00',
    updatedAt: '2024-03-28T15:00:00',
  },
  {
    id: 'BID-005',
    tenderId: 'TND-2024-003',
    supplierId: 'S006',
    supplierName: 'InfraBuilders Co',
    items: [
      { name: 'Conference Room Renovation', unitPrice: 720000, quantity: 1, total: 720000 },
      { name: '85" 4K Display + AV System', unitPrice: 95000, quantity: 1, total: 95000 },
    ],
    totalAmount: 815000,
    deliveryDays: 45,
    validUntil: '2024-06-30',
    terms: 'Project completion in 45 days. Includes design consultation. 2-year warranty on all installations.',
    status: 'under_review',
    submittedAt: '2024-03-20T10:00:00',
    updatedAt: '2024-03-20T10:00:00',
  },
  {
    id: 'BID-006',
    tenderId: 'TND-2024-004',
    supplierId: 'S002',
    supplierName: 'SoftLicense Solutions',
    items: [{ name: 'GitHub Enterprise Server - 50 seats - Annual', unitPrice: 450000, quantity: 1, total: 450000 }],
    totalAmount: 450000,
    deliveryDays: 3,
    validUntil: '2024-05-10',
    terms: 'License activation within 3 business days. Includes migration support and 24/7 premium support.',
    status: 'submitted',
    submittedAt: '2024-03-20T08:00:00',
    updatedAt: '2024-03-20T08:00:00',
  },
];

// ── Helper Functions ──
export const getStatusBadgeClass = (status) => {
  const map = {
    draft: 'badge-neutral',
    returned: 'badge-warning',
    pending_manager: 'badge-warning',
    pending_senior_manager: 'badge-warning',
    pending_head: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    in_procurement: 'badge-info',
    delivered: 'badge-primary',
    closed: 'badge-neutral',
    active: 'badge-success',
    suspended: 'badge-danger',
    blacklisted: 'badge-danger',
    inactive: 'badge-neutral',
    paid: 'badge-success',
    processing: 'badge-info',
    verified: 'badge-primary',
    on_hold: 'badge-warning',
    pending: 'badge-warning',
    failed: 'badge-danger',
    sent: 'badge-info',
    accepted: 'badge-primary',
    pending_finance: 'badge-warning',
    finance_approved: 'badge-success',
    finance_rejected: 'badge-danger',
    in_transit: 'badge-info',
    cancelled: 'badge-danger',
    // Tender statuses
    open: 'badge-success',
    evaluation: 'badge-warning',
    awarded: 'badge-primary',
    cancelled: 'badge-danger',
    // Bid statuses
    submitted: 'badge-info',
    under_review: 'badge-warning',
    // Quotation statuses
    pending_finance: 'badge-warning',
    finance_approved: 'badge-success',
    not_selected: 'badge-neutral',
    quoted: 'badge-info',
    shortlisted: 'badge-primary',
    withdrawn: 'badge-neutral',
  };
  return map[status] || 'badge-neutral';
};

export const getStatusLabel = (status) => {
  const map = {
    draft: 'Draft',
    returned: 'Returned for Correction',
    pending_manager: 'Pending Manager',
    pending_senior_manager: 'Pending Sr. Manager',
    pending_head: 'Pending Head',
    approved: 'Approved',
    rejected: 'Rejected',
    in_procurement: 'In Procurement',
    delivered: 'Delivered',
    closed: 'Closed',
    active: 'Active',
    suspended: 'Suspended',
    blacklisted: 'Blacklisted',
    inactive: 'Inactive',
    paid: 'Paid',
    processing: 'Payment In Process',
    verified: 'Invoice Verified',
    on_hold: 'On Hold',
    pending: 'Pending',
    failed: 'Failed',
    sent: 'Issued to Supplier',
    accepted: 'Accepted',
    pending_finance: 'Pending Finance Approval',
    finance_approved: 'Finance Approved',
    finance_rejected: 'Finance Rejected',
    in_transit: 'In Transit',
    cancelled: 'Cancelled',
    // Tender statuses
    open: 'Open',
    evaluation: 'Under Evaluation',
    awarded: 'Awarded',
    cancelled: 'Cancelled',
    // Bid statuses
    submitted: 'Submitted',
    under_review: 'Under Review',
    // Quotation statuses
    pending_finance: 'Pending Finance Approval',
    finance_approved: 'Approved by Finance',
    not_selected: 'Not Selected',
    quoted: 'Quotation Received',
    shortlisted: 'Shortlisted',
    withdrawn: 'Withdrawn',
  };
  return map[status] || status;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
