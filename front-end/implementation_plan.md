# Enterprise Procurement System (EPS) — Frontend Implementation Plan

## Overview

Build a **frontend-only** role-based Enterprise Procurement System using **Vite + React**. The system digitizes the complete procurement lifecycle with 12 user roles, rich dashboards with charts, approval workflows, supplier management, purchase orders, finance processing, and audit trails. All data will be mocked (no backend yet).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Build Tool | Vite |
| Framework | React 18+ |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| CSS | Vanilla CSS (design system with CSS variables) |
| Mock Data | JSON files + React Context |
| State | React Context + useReducer |

---

## User Review Required

> [!IMPORTANT]
> This is a **massive** frontend project (~100+ components, 12 roles, 7+ dashboards, multiple workflow views). Building everything in one pass will result in a very large codebase. I'll build it **incrementally by phase**, starting with the foundation and core modules first.

> [!NOTE]
> All data is **mocked** — no backend calls. Each service file contains **commented-out `fetch()` API calls** with the exact expected **request/response JSON formats**. To switch to the real backend, just set `API_BASE_URL` and uncomment the API calls.

---

## Proposed Changes

### Phase 1 — Project Scaffold

#### [NEW] Project initialization via `npx create-vite`

- Initialize Vite + React project  
- Install: `react-router-dom`, `recharts`, `lucide-react`

#### [NEW] `src/styles/` — Design System

- `variables.css` — Color palette (dark theme), spacing, radii, shadows, typography
- `global.css` — Resets, base styles, utility classes
- `components.css` — Shared component styles (cards, buttons, tables, badges, forms)

#### [NEW] `src/data/mockData.js` — Mock Data

- Users, departments, categories, requests, suppliers, POs, invoices, notifications, audit logs  
- All with realistic sample data using ₹ currency

---

### Phase 1.5 — API Service Layer (Commented-Out, Ready for Spring Boot)

Every service file follows this pattern:
1. **`API_BASE_URL`** imported from a single config file — set once, applies everywhere
2. **Active mock functions** that return mock data (used now)
3. **Commented-out `fetch()` calls** with exact endpoint, method, headers, body, and response JSON schema
4. **JSDoc comments** documenting the expected request/response data format

#### [NEW] `src/services/apiConfig.js` — Central API Configuration
```js
// ============================================
// STEP 1: Set your Spring Boot backend URL here
// STEP 2: Uncomment the real API calls in each service file
// ============================================
// export const API_BASE_URL = 'http://localhost:8080/api';
export const API_BASE_URL = ''; // empty = mock mode
```

#### [NEW] `src/services/authService.js`
- `POST /auth/login` — `{ username, password }` → `{ token, user, role }`
- `POST /auth/register`, `POST /auth/reset-password`, `GET /auth/profile`

#### [NEW] `src/services/userService.js`
- `GET /users`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`
- Response: `{ id, name, email, role, department, status, createdAt }`

#### [NEW] `src/services/requestService.js`
- `GET /requests`, `POST /requests`, `PUT /requests/:id`, `PATCH /requests/:id/submit`, `PATCH /requests/:id/cancel`
- Response: `{ id, title, description, category, estimatedCost, status, createdBy, department, ... }`

#### [NEW] `src/services/approvalService.js`
- `GET /approvals/pending`, `POST /approvals/:id/approve`, `POST /approvals/:id/reject`, `POST /approvals/:id/return`
- Response: `{ id, requestId, approverRole, action, comments, timestamp }`

#### [NEW] `src/services/supplierService.js`
- `GET /suppliers`, `POST /suppliers`, `PUT /suppliers/:id`, `PATCH /suppliers/:id/status`
- Response: `{ id, companyName, gstNumber, panNumber, bankDetails, status, ... }`

#### [NEW] `src/services/purchaseOrderService.js`
- `GET /purchase-orders`, `POST /purchase-orders`, `PATCH /purchase-orders/:id/status`
- Response: `{ poNumber, supplierId, items[], totalAmount, taxes, deliveryDate, status }`

#### [NEW] `src/services/grnService.js`
- `GET /grn`, `POST /grn`
- Response: `{ grnNumber, poNumber, items[], verifiedBy, qualityCheck, handoverStatus }`

#### [NEW] `src/services/financeService.js`
- `GET /payments`, `POST /payments/verify`, `POST /payments/process`
- Response: `{ transactionId, poNumber, amount, paymentMethod, status, paidDate }`

#### [NEW] `src/services/dashboardService.js`
- `GET /dashboard/employee`, `GET /dashboard/manager`, `GET /dashboard/head`, etc.
- Response: role-specific stats, chart data arrays, KPIs

#### [NEW] `src/services/notificationService.js`
- `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`

#### [NEW] `src/services/auditService.js`
- `GET /audit-logs` with filter params
- Response: `{ user, role, action, timestamp, previousValue, updatedValue, ipAddress, remarks }`

#### [NEW] `src/services/departmentService.js`, `categoryService.js`
- CRUD for departments and categories

### Phase 2 — Auth & Layout

#### [NEW] `src/contexts/AuthContext.jsx`
- Mock login with role selection  
- `currentUser`, `login()`, `logout()`, `hasRole()`

#### [NEW] `src/components/Layout/` — App Shell
- `MainLayout.jsx` — Sidebar + Header + Content
- `Sidebar.jsx` — Role-aware navigation links
- `Header.jsx` — User info, notifications bell, logout

#### [NEW] `src/pages/Login.jsx`
- Role-based login (select user → auto-login with that role)

#### [NEW] `src/components/ProtectedRoute.jsx`
- Route guard checking auth + role

---

### Phase 3 — Dashboards (7 role dashboards)

Each dashboard includes stat cards and Recharts charts.

#### [NEW] `src/pages/dashboards/EmployeeDashboard.jsx`
- Stat cards: total/pending/approved/rejected requests
- Bar chart: requests by month; Pie chart: requests by category

#### [NEW] `src/pages/dashboards/ManagerDashboard.jsx`  
- Pending approvals, spending by employee, approval rate chart

#### [NEW] `src/pages/dashboards/SeniorManagerDashboard.jsx`
- Budget cards, department spending bar chart, escalated requests

#### [NEW] `src/pages/dashboards/HeadDashboard.jsx`
- Executive analytics: total/monthly/annual spend, budget utilization gauge, category/dept spending, monthly trends line chart, supplier performance

#### [NEW] `src/pages/dashboards/ProcurementDashboard.jsx`
- Approved requests, PO pipeline, supplier comparison

#### [NEW] `src/pages/dashboards/FinanceDashboard.jsx`
- Pending invoices/payments, revenue charts, spending trends

#### [NEW] `src/pages/dashboards/AdminDashboard.jsx`
- System stats: users, roles, departments, categories, audit log count

---

### Phase 4 — Request Management

#### [NEW] `src/pages/requests/RequestList.jsx`
- Filterable/sortable table with status badges

#### [NEW] `src/pages/requests/CreateRequest.jsx`
- Form: title, description, reason, category, subcategory, qty, estimated cost, required date  
- Save Draft / Submit buttons

#### [NEW] `src/pages/requests/RequestDetail.jsx`
- Full request info + approval timeline + action buttons

---

### Phase 5 — Approval Workflow

#### [NEW] `src/pages/approvals/ApprovalQueue.jsx`
- Filterable list of pending approvals for the logged-in role
- Approve / Reject / Return for Correction buttons
- Comment modal

#### [NEW] `src/components/ApprovalTimeline.jsx`
- Visual step timeline showing approval chain with status per step

---

### Phase 6 — Procurement & Teams

#### [NEW] `src/pages/procurement/ProcurementQueue.jsx`
- Approved requests awaiting procurement action

#### [NEW] `src/pages/procurement/EquipmentWorkflow.jsx`
- Step-by-step workflow: supplier selection → quotation → PO → delivery → GRN → handover

#### [NEW] `src/pages/procurement/SoftwareWorkflow.jsx`
- License check → assign or purchase → activation → handover

#### [NEW] `src/pages/procurement/FacilitiesWorkflow.jsx`
- Vendor coordination → delivery → inspection → GRN → handover

---

### Phase 7 — Supplier Management

#### [NEW] `src/pages/suppliers/SupplierList.jsx`
- Table with lifecycle status badges, search/filter

#### [NEW] `src/pages/suppliers/SupplierDetail.jsx`
- Company info, KYC, bank details, documents, lifecycle actions

#### [NEW] `src/pages/suppliers/SupplierForm.jsx`
- Create/edit supplier with full field set

---

### Phase 8 — Purchase Orders & GRN

#### [NEW] `src/pages/orders/PurchaseOrderList.jsx`
- PO table with status filtering

#### [NEW] `src/pages/orders/PurchaseOrderDetail.jsx`
- PO info, line items, supplier, delivery status

#### [NEW] `src/pages/orders/CreatePurchaseOrder.jsx`
- PO creation form with item lines

#### [NEW] `src/pages/grn/GoodsReceiptForm.jsx`
- Quantity verification, quality check, GRN generation

---

### Phase 9 — Finance

#### [NEW] `src/pages/finance/InvoiceVerification.jsx`
- PO match, GRN match, tax verification, amount check

#### [NEW] `src/pages/finance/PaymentProcessing.jsx`
- Payment list, status tracking, payment processing form

---

### Phase 10 — Admin

#### [NEW] `src/pages/admin/UserManagement.jsx`
#### [NEW] `src/pages/admin/RoleManagement.jsx`
#### [NEW] `src/pages/admin/DepartmentManagement.jsx`
#### [NEW] `src/pages/admin/CategoryManagement.jsx`
#### [NEW] `src/pages/admin/ApprovalRules.jsx`
#### [NEW] `src/pages/admin/AuditLogs.jsx`

Each with CRUD table + modal or form.

---

### Phase 11 — Notifications

#### [NEW] `src/components/NotificationCenter.jsx`
- Dropdown from header bell icon
- List of notifications with read/unread state
- Type-based icons

---

## Verification Plan

### Browser Visual Testing
After each phase, I will launch the dev server and verify:
1. Open `http://localhost:5173` in the browser
2. Test login with different roles
3. Verify correct dashboard loads per role
4. Navigate through all sidebar links
5. Test form interactions (create request, create PO, etc.)
6. Verify charts render with mock data
7. Test responsive layout

### Manual Verification (User)
- After implementation, the user can run `npm run dev` and browse through all roles
- Each role's sidebar should show only relevant navigation
- All charts should render with realistic mock data
- All forms should be interactive (save/submit/cancel)
