# Procurement Backend — API Reference

Base URL: `http://localhost:8080`
All non-auth endpoints require: `Authorization: Bearer <jwt>`
Content-Type: `application/json`

## Response envelope

```json
{ "success": true,  "message": "...", "data": { } }
{ "success": false, "message": "...", "errors": ["..."] }
```

## Roles

`EMPLOYEE`, `MANAGER`, `SENIOR_MANAGER`, `HEAD`, `PROCUREMENT_OFFICER`, `FINANCE_OFFICER`, `ADMIN`

---

## Auth — `/api/auth`

| Method | Path                  | Auth | Body / Notes |
|--------|-----------------------|------|--------------|
| POST   | `/register`           | Public | `{ username, email, password, fullName, role, departmentId? }` |
| POST   | `/login`              | Public | `{ username, password }` → returns JWT |
| POST   | `/forgot-password`    | Public | `{ email }` → returns `resetToken` (dev) |
| POST   | `/reset-password`     | Public | `{ token, newPassword }` |
| GET    | `/profile`            | Any authenticated | Current user |

---

## Dashboard — `/api/dashboard`

| Method | Path              | Allowed roles |
|--------|-------------------|---------------|
| GET    | `/employee`       | EMPLOYEE, MANAGER, SENIOR_MANAGER, HEAD, ADMIN |
| GET    | `/manager`        | MANAGER, ADMIN |
| GET    | `/senior-manager` | SENIOR_MANAGER, ADMIN |
| GET    | `/head`           | HEAD, ADMIN |
| GET    | `/finance`        | FINANCE_OFFICER, ADMIN |
| GET    | `/admin`          | ADMIN |

---

## Purchase Requests — `/api/purchase-requests`

| Method | Path       | Notes |
|--------|------------|-------|
| GET    | `/`        | All requests |
| GET    | `/my`      | Current user's requests |
| GET    | `/{id}`    | By id |
| POST   | `/`        | Create — `{ category, description, quantity, estimatedCost, justification?, priority?, departmentId? }` |
| PUT    | `/{id}`    | Update (same body) |
| DELETE | `/{id}`    | Delete |

---

## Approvals — `/api/approvals`

Pending queues:

| Method | Path              | Roles |
|--------|-------------------|-------|
| GET    | `/manager`        | MANAGER, ADMIN |
| GET    | `/senior-manager` | SENIOR_MANAGER, ADMIN |
| GET    | `/head`           | HEAD, ADMIN |

Actions (body optional: `{ "comments": "..." }`):

| Method | Path                              | Roles |
|--------|-----------------------------------|-------|
| PUT    | `/{id}/manager/approve`           | MANAGER, ADMIN |
| PUT    | `/{id}/manager/reject`            | MANAGER, ADMIN |
| PUT    | `/{id}/manager/return`            | MANAGER, ADMIN |
| PUT    | `/{id}/senior-manager/approve`    | SENIOR_MANAGER, ADMIN |
| PUT    | `/{id}/senior-manager/reject`     | SENIOR_MANAGER, ADMIN |
| PUT    | `/{id}/senior-manager/return`     | SENIOR_MANAGER, ADMIN |
| PUT    | `/{id}/head/approve`              | HEAD, ADMIN |
| PUT    | `/{id}/head/reject`               | HEAD, ADMIN |
| PUT    | `/{id}/head/return`               | HEAD, ADMIN |

---

## Suppliers — `/api/suppliers`

| Method | Path     | Notes |
|--------|----------|-------|
| GET    | `/`      | List |
| GET    | `/{id}`  | By id |
| POST   | `/`      | Create |
| PUT    | `/{id}`  | Update |
| DELETE | `/{id}`  | Delete |

---

## Purchase Orders — `/api/purchase-orders`

| Method | Path     | Notes |
|--------|----------|-------|
| GET    | `/`      | List all POs |
| GET    | `/{id}`  | By id |
| POST   | `/`      | Create PO from approved request |
| PUT    | `/{id}`  | Update |

## Procurement Officer Orders — `/api/procurement/orders`

Roles: `PROCUREMENT_OFFICER`, `ADMIN`

| Method | Path     |
|--------|----------|
| GET    | `/`      |
| POST   | `/`      |
| PUT    | `/{id}`  |

---

## Goods Receipts — `/api/goods-receipts`

| Method | Path     | Notes |
|--------|----------|-------|
| GET    | `/`      | List |
| POST   | `/`      | Record receipt against a PO |
| PUT    | `/{id}`  | Update |

---

## Invoices — `/api/invoices`

| Method | Path     | Notes |
|--------|----------|-------|
| GET    | `/`      | List |
| GET    | `/{id}`  | By id |
| POST   | `/`      | Create invoice |
| PUT    | `/{id}`  | Update / mark verified |

---

## Payments — `/api/payments`

| Method | Path       | Roles | Notes |
|--------|------------|-------|-------|
| GET    | `/`        | Any   | List all |
| GET    | `/history` | Any   | Payment history |
| POST   | `/`        | FINANCE_OFFICER, ADMIN | Record payment |

---

## Notifications — `/api/notifications`

| Method | Path          | Notes |
|--------|---------------|-------|
| GET    | `/`           | Current user's notifications + unread count |
| PUT    | `/{id}/read`  | Mark as read |

---

## Reports — `/api/reports`

| Method | Path           | Notes |
|--------|----------------|-------|
| GET    | `/monthly`     | Monthly spend report |
| GET    | `/yearly`      | Yearly spend report |
| GET    | `/budget`      | Budget usage by department |
| GET    | `/procurement` | Procurement KPIs |

---

## Auth flow (frontend integration)

1. `POST /api/auth/login` → save `data.token`.
2. Attach `Authorization: Bearer <token>` to every subsequent request.
3. On `401`, redirect to login. On `403`, user lacks role for endpoint.

## Workflow summary

```
Employee creates PR
   → Manager approve
   → Senior Manager approve
   → Head approve
   → Procurement Officer creates PO → sent to Supplier
   → Goods Receipt recorded
   → Invoice created & verified
   → Finance Officer records Payment
```

Request `currentStatus` and `approvalStage` update automatically after each stage.
