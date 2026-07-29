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
  { id: 'REQ-2024-008', title: 'Wireless Keyboard & Mouse Set', description: 'Logitech MX Keys and MX Master 3S', reason: 'Old peripherals malfunctioning', category: 'Equipment & Assets', subcategory: 'Keyboard', quantity: 5, estimatedCost: 62500, department: 'Marketing', requiredDate: '2024-04-05', status: 'draft', createdBy: 'U002', createdAt: '2024-03-14', updatedAt: '2024-03-14', priority: 'low' },
  { id: 'REQ-2024-009', title: 'Conference Room Renovation', description: 'Renovation of main conference room including AV equipment', reason: 'Outdated facilities', category: 'Facilities', subcategory: 'Renovation', quantity: 1, estimatedCost: 850000, department: 'Facilities', requiredDate: '2024-06-01', status: 'approved', createdBy: 'U009', createdAt: '2024-01-20', updatedAt: '2024-03-01', priority: 'high' },
  { id: 'REQ-2024-010', title: 'AWS Cloud Credits', description: 'Cloud infrastructure credits for Q2', reason: 'Scaling production infrastructure', category: 'Software & Digital Services', subcategory: 'Cloud Service', quantity: 1, estimatedCost: 500000, department: 'Engineering', requiredDate: '2024-04-01', status: 'rejected', createdBy: 'U001', createdAt: '2024-02-28', updatedAt: '2024-03-08', priority: 'high' },
  { id: 'REQ-2024-011', title: 'Logitech Webcam C930e', description: 'HD webcam for video conferencing', reason: 'Remote meetings quality', category: 'Equipment & Assets', subcategory: 'Webcam', quantity: 8, estimatedCost: 56000, department: 'Engineering', requiredDate: '2024-04-10', status: 'delivered', createdBy: 'U001', createdAt: '2024-01-15', updatedAt: '2024-03-10', priority: 'medium' },
  { id: 'REQ-2024-012', title: 'Slack Enterprise Grid', description: 'Upgrade communication platform', reason: 'Enterprise security features needed', category: 'Software & Digital Services', subcategory: 'SaaS Subscription', quantity: 1, estimatedCost: 420000, department: 'IT', requiredDate: '2024-05-01', status: 'closed', createdBy: 'U001', createdAt: '2024-01-05', updatedAt: '2024-03-15', priority: 'high' },
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
  { id: 'S001', companyName: 'TechnoHub India Pvt Ltd', businessType: 'IT Equipment Distributor', gstNumber: '29AABCT1234F1Z5', panNumber: 'AABCT1234F', bankName: 'HDFC Bank', accountNumber: '50200012345678', ifsc: 'HDFC0001234', contactPerson: 'Amit Shah', phone: '9988776655', email: 'sales@technohub.in', address: '123, Electronic City, Bangalore - 560100', status: 'active', rating: 4.5, totalOrders: 28, createdAt: '2023-01-10' },
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
  { id: 'PO-2024-005', requestId: 'REQ-2024-011', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', items: [{ name: 'Logitech C930e Webcam', quantity: 8, unitPrice: 6500, total: 52000 }], subtotal: 52000, tax: 9360, totalAmount: 61360, deliveryDate: '2024-03-05', status: 'closed', createdAt: '2024-02-01', createdBy: 'U006' },
  { id: 'PO-2024-006', requestId: 'REQ-2024-012', supplierId: 'S002', supplierName: 'SoftLicense Solutions', items: [{ name: 'Slack Enterprise Grid - Annual', quantity: 1, unitPrice: 400000, total: 400000 }], subtotal: 400000, tax: 72000, totalAmount: 472000, deliveryDate: '2024-02-15', status: 'closed', createdAt: '2024-01-10', createdBy: 'U006' },
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
  { id: 'PAY-2024-001', poNumber: 'PO-2024-005', supplierName: 'TechnoHub India Pvt Ltd', amount: 61360, paymentMethod: 'NEFT', referenceNumber: 'NEFT-20240310-001', status: 'paid', paidDate: '2024-03-10', verifiedBy: 'U010', transactionId: 'TXN-HDFC-20240310-001' },
  { id: 'PAY-2024-002', poNumber: 'PO-2024-006', supplierName: 'SoftLicense Solutions', amount: 472000, paymentMethod: 'RTGS', referenceNumber: 'RTGS-20240220-001', status: 'paid', paidDate: '2024-02-20', verifiedBy: 'U010', transactionId: 'TXN-HDFC-20240220-001' },
  { id: 'PAY-2024-003', poNumber: 'PO-2024-001', supplierName: 'TechnoHub India Pvt Ltd', amount: 218300, paymentMethod: 'NEFT', referenceNumber: 'NEFT-20240415-001', status: 'processing', paidDate: null, verifiedBy: 'U010', transactionId: null },
  { id: 'PAY-2024-004', poNumber: 'PO-2024-002', supplierName: 'FurniCraft Enterprises', amount: 259600, paymentMethod: 'NEFT', referenceNumber: null, status: 'pending', paidDate: null, verifiedBy: null, transactionId: null },
  { id: 'PAY-2024-005', poNumber: 'PO-2024-004', supplierName: 'InfraBuilders Co', amount: 985300, paymentMethod: 'RTGS', referenceNumber: null, status: 'pending', paidDate: null, verifiedBy: null, transactionId: null },
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

// ── Quotations ──
export const quotations = [
  { id: 'Q001', requestId: 'REQ-2024-001', supplierId: 'S001', supplierName: 'TechnoHub India Pvt Ltd', items: [{ name: 'MacBook Pro 16" M3 Pro', unitPrice: 185000, quantity: 1 }], totalAmount: 185000, validUntil: '2024-04-30', status: 'accepted', submittedAt: '2024-03-04' },
  { id: 'Q002', requestId: 'REQ-2024-001', supplierId: 'S004', supplierName: 'CloudFirst Technologies', items: [{ name: 'MacBook Pro 16" M3 Pro', unitPrice: 192000, quantity: 1 }], totalAmount: 192000, validUntil: '2024-04-30', status: 'rejected', submittedAt: '2024-03-04' },
  { id: 'Q003', requestId: 'REQ-2024-006', supplierId: 'S003', supplierName: 'FurniCraft Enterprises', items: [{ name: 'Ergonomic Office Chair', unitPrice: 22000, quantity: 10 }], totalAmount: 220000, validUntil: '2024-05-15', status: 'accepted', submittedAt: '2024-03-10' },
  { id: 'Q004', requestId: 'REQ-2024-006', supplierId: 'S006', supplierName: 'InfraBuilders Co', items: [{ name: 'Ergonomic Office Chair', unitPrice: 25000, quantity: 10 }], totalAmount: 250000, validUntil: '2024-05-15', status: 'rejected', submittedAt: '2024-03-10' },
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

// ── Helper Functions ──
export const getStatusBadgeClass = (status) => {
  const map = {
    draft: 'badge-neutral',
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
    pending: 'badge-warning',
    failed: 'badge-danger',
    sent: 'badge-info',
    accepted: 'badge-primary',
  };
  return map[status] || 'badge-neutral';
};

export const getStatusLabel = (status) => {
  const map = {
    draft: 'Draft',
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
    processing: 'Processing',
    pending: 'Pending',
    failed: 'Failed',
    sent: 'Sent',
    accepted: 'Accepted',
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
