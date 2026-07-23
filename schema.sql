-- ============================================================
-- Enterprise Procurement System – Standalone MySQL Schema
-- Run against an empty schema:  mysql -u root -p enterprise_procurement < schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS enterprise_procurement
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE enterprise_procurement;

-- ── role ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS role (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(50)  NOT NULL,
    description TEXT,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_role_name (name)
) ENGINE=InnoDB;

-- ── department ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS department (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(20)  NOT NULL,
    description TEXT,
    created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_dept_code (code)
) ENGINE=InnoDB;

-- ── cost_center ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cost_center (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    department_id BIGINT       NOT NULL,
    code          VARCHAR(20)  NOT NULL,
    name          VARCHAR(100) NOT NULL,
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_cc_code (code),
    CONSTRAINT fk_cc_dept FOREIGN KEY (department_id) REFERENCES department (id)
) ENGINE=InnoDB;

-- ── users ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id                   BIGINT       NOT NULL AUTO_INCREMENT,
    role_id              BIGINT       NOT NULL,
    department_id        BIGINT       NOT NULL,
    cost_center_id       BIGINT,
    reporting_manager_id BIGINT,
    employee_code        VARCHAR(20)  NOT NULL,
    first_name           VARCHAR(60)  NOT NULL,
    last_name            VARCHAR(60)  NOT NULL,
    email                VARCHAR(150) NOT NULL,
    phone                VARCHAR(20),
    password_hash        VARCHAR(255) NOT NULL,
    is_active            TINYINT(1)   NOT NULL DEFAULT 1,
    created_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at           DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_user_email    (email),
    UNIQUE KEY uq_user_emp_code (employee_code),
    CONSTRAINT fk_user_role    FOREIGN KEY (role_id)              REFERENCES role        (id),
    CONSTRAINT fk_user_dept    FOREIGN KEY (department_id)        REFERENCES department  (id),
    CONSTRAINT fk_user_cc      FOREIGN KEY (cost_center_id)       REFERENCES cost_center (id),
    CONSTRAINT fk_user_manager FOREIGN KEY (reporting_manager_id) REFERENCES users       (id)
) ENGINE=InnoDB;

-- ── procurement_team ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS procurement_team (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ── category ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS category (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    procurement_team_id BIGINT       NOT NULL,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_cat_team FOREIGN KEY (procurement_team_id) REFERENCES procurement_team (id)
) ENGINE=InnoDB;

-- ── subcategory ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcategory (
    id          BIGINT       NOT NULL AUTO_INCREMENT,
    category_id BIGINT       NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_subcat_cat FOREIGN KEY (category_id) REFERENCES category (id)
) ENGINE=InnoDB;

-- ── category_routing_rule ─────────────────────────────────
CREATE TABLE IF NOT EXISTS category_routing_rule (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    category_id      BIGINT      NOT NULL,
    responsible_team VARCHAR(30) NOT NULL,
    is_active        TINYINT(1)  NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    CONSTRAINT fk_crr_cat FOREIGN KEY (category_id) REFERENCES category (id)
) ENGINE=InnoDB;

-- ── supplier ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    company_name        VARCHAR(200) NOT NULL,
    business_type       VARCHAR(100),
    registration_number VARCHAR(50),
    gst_number          VARCHAR(20),
    pan_number          VARCHAR(15),
    contact_person      VARCHAR(100),
    email               VARCHAR(150),
    phone               VARCHAR(20),
    address             TEXT,
    bank_name           VARCHAR(100),
    account_number      VARCHAR(50),
    ifsc                VARCHAR(15),
    status              VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
    is_active           TINYINT(1)   NOT NULL DEFAULT 1,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_supplier_email (email)
) ENGINE=InnoDB;

-- ── supplier_kyc_document ─────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_kyc_document (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    supplier_id         BIGINT       NOT NULL,
    document_type       VARCHAR(100) NOT NULL,
    file_url            VARCHAR(500) NOT NULL,
    verification_status VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    uploaded_at         DATETIME(6),
    verified_at         DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_kyc_supplier FOREIGN KEY (supplier_id) REFERENCES supplier (id)
) ENGINE=InnoDB;

-- ── supplier_category ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS supplier_category (
    supplier_id    BIGINT NOT NULL,
    subcategory_id BIGINT NOT NULL,
    PRIMARY KEY (supplier_id, subcategory_id),
    CONSTRAINT fk_sc_supplier    FOREIGN KEY (supplier_id)    REFERENCES supplier    (id),
    CONSTRAINT fk_sc_subcategory FOREIGN KEY (subcategory_id) REFERENCES subcategory (id)
) ENGINE=InnoDB;

-- ── approval_rule ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS approval_rule (
    id                      BIGINT         NOT NULL AUTO_INCREMENT,
    min_amount              DECIMAL(15, 2) NOT NULL,
    max_amount              DECIMAL(15, 2),
    manager_required        TINYINT(1)     NOT NULL DEFAULT 0,
    senior_manager_required TINYINT(1)     NOT NULL DEFAULT 0,
    head_required           TINYINT(1)     NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ── request ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS request (
    id                  BIGINT         NOT NULL AUTO_INCREMENT,
    request_no          VARCHAR(30)    NOT NULL,
    employee_id         BIGINT         NOT NULL,
    category_id         BIGINT         NOT NULL,
    subcategory_id      BIGINT         NOT NULL,
    title               VARCHAR(200)   NOT NULL,
    item_service_name   VARCHAR(200)   NOT NULL,
    description         TEXT,
    reason              TEXT,
    quantity            INT            NOT NULL,
    estimated_cost      DECIMAL(15, 2) NOT NULL,
    required_date       DATE,
    status              VARCHAR(20)    NOT NULL DEFAULT 'DRAFT',
    current_approver_id BIGINT,
    assigned_team       VARCHAR(30),
    created_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_request_no (request_no),
    CONSTRAINT fk_req_employee    FOREIGN KEY (employee_id)         REFERENCES users       (id),
    CONSTRAINT fk_req_category    FOREIGN KEY (category_id)         REFERENCES category    (id),
    CONSTRAINT fk_req_subcategory FOREIGN KEY (subcategory_id)      REFERENCES subcategory (id),
    CONSTRAINT fk_req_approver    FOREIGN KEY (current_approver_id) REFERENCES users       (id)
) ENGINE=InnoDB;

-- ── request_attachment ────────────────────────────────────
CREATE TABLE IF NOT EXISTS request_attachment (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    request_id BIGINT       NOT NULL,
    file_name  VARCHAR(255) NOT NULL,
    file_url   VARCHAR(500) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_att_request FOREIGN KEY (request_id) REFERENCES request (id)
) ENGINE=InnoDB;

-- ── request_approval ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS request_approval (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    request_id     BIGINT      NOT NULL,
    approver_id    BIGINT      NOT NULL,
    approval_level VARCHAR(50) NOT NULL,
    action         VARCHAR(20) NOT NULL,
    comments       TEXT,
    approved_at    DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_ra_request  FOREIGN KEY (request_id)  REFERENCES request (id),
    CONSTRAINT fk_ra_approver FOREIGN KEY (approver_id) REFERENCES users   (id)
) ENGINE=InnoDB;

-- ── quotation ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotation (
    id            BIGINT         NOT NULL AUTO_INCREMENT,
    request_id    BIGINT         NOT NULL,
    supplier_id   BIGINT         NOT NULL,
    amount        DECIMAL(15, 2) NOT NULL,
    delivery_days INT,
    remarks       TEXT,
    is_selected   TINYINT(1)     NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_quot_request  FOREIGN KEY (request_id)  REFERENCES request  (id),
    CONSTRAINT fk_quot_supplier FOREIGN KEY (supplier_id) REFERENCES supplier (id)
) ENGINE=InnoDB;

-- ── purchase_order ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_order (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    po_number         VARCHAR(30)    NOT NULL,
    request_id        BIGINT         NOT NULL,
    supplier_id       BIGINT         NOT NULL,
    created_by        BIGINT         NOT NULL,
    total_amount      DECIMAL(15, 2) NOT NULL,
    tax               DECIMAL(10, 2),
    delivery_address  TEXT,
    expected_delivery DATE,
    payment_terms     VARCHAR(200),
    status            VARCHAR(20)    NOT NULL DEFAULT 'DRAFT',
    created_at        DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)    NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_po_number (po_number),
    CONSTRAINT fk_po_request  FOREIGN KEY (request_id)  REFERENCES request  (id),
    CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES supplier (id),
    CONSTRAINT fk_po_created  FOREIGN KEY (created_by)  REFERENCES users    (id)
) ENGINE=InnoDB;

-- ── purchase_order_item ───────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_order_item (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    purchase_order_id BIGINT         NOT NULL,
    description       VARCHAR(300)   NOT NULL,
    quantity          INT            NOT NULL,
    unit_price        DECIMAL(15, 2) NOT NULL,
    total_price       DECIMAL(15, 2) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_poi_po FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (id)
) ENGINE=InnoDB;

-- ── goods_receipt ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goods_receipt (
    id                BIGINT      NOT NULL AUTO_INCREMENT,
    purchase_order_id BIGINT      NOT NULL,
    grn_number        VARCHAR(30) NOT NULL,
    received_quantity INT         NOT NULL,
    accepted_quantity INT         NOT NULL,
    rejected_quantity INT         NOT NULL,
    remarks           TEXT,
    received_by       BIGINT      NOT NULL,
    received_at       DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_grn_number (grn_number),
    CONSTRAINT fk_grn_po          FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (id),
    CONSTRAINT fk_grn_received_by FOREIGN KEY (received_by)       REFERENCES users          (id)
) ENGINE=InnoDB;

-- ── handover ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS handover (
    id               BIGINT      NOT NULL AUTO_INCREMENT,
    goods_receipt_id BIGINT      NOT NULL,
    employee_id      BIGINT      NOT NULL,
    handover_date    DATETIME(6),
    confirmation     TINYINT(1)  NOT NULL DEFAULT 0,
    courier_details  TEXT,
    PRIMARY KEY (id),
    CONSTRAINT fk_ho_grn      FOREIGN KEY (goods_receipt_id) REFERENCES goods_receipt (id),
    CONSTRAINT fk_ho_employee FOREIGN KEY (employee_id)      REFERENCES users         (id)
) ENGINE=InnoDB;

-- ── software_assignment ───────────────────────────────────
CREATE TABLE IF NOT EXISTS software_assignment (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    request_id      BIGINT       NOT NULL,
    employee_id     BIGINT       NOT NULL,
    license_key     VARCHAR(200),
    activation_date DATE,
    expiry_date     DATE,
    confirmation    TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    CONSTRAINT fk_sa_request  FOREIGN KEY (request_id)  REFERENCES request (id),
    CONSTRAINT fk_sa_employee FOREIGN KEY (employee_id) REFERENCES users   (id)
) ENGINE=InnoDB;

-- ── invoice ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoice (
    id                BIGINT         NOT NULL AUTO_INCREMENT,
    purchase_order_id BIGINT         NOT NULL,
    supplier_id       BIGINT         NOT NULL,
    invoice_number    VARCHAR(50)    NOT NULL,
    invoice_date      DATE           NOT NULL,
    amount            DECIMAL(15, 2) NOT NULL,
    tax               DECIMAL(10, 2),
    PRIMARY KEY (id),
    CONSTRAINT fk_inv_po       FOREIGN KEY (purchase_order_id) REFERENCES purchase_order (id),
    CONSTRAINT fk_inv_supplier FOREIGN KEY (supplier_id)       REFERENCES supplier       (id)
) ENGINE=InnoDB;

-- ── payment ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    invoice_id       BIGINT         NOT NULL,
    processed_by     BIGINT         NOT NULL,
    amount           DECIMAL(15, 2) NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    payment_method   VARCHAR(50),
    transaction_id   VARCHAR(100),
    reference_number VARCHAR(100),
    payment_date     DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_pay_invoice      FOREIGN KEY (invoice_id)   REFERENCES invoice (id),
    CONSTRAINT fk_pay_processed_by FOREIGN KEY (processed_by) REFERENCES users   (id)
) ENGINE=InnoDB;

-- ── budget ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget (
    id               BIGINT         NOT NULL AUTO_INCREMENT,
    department_id    BIGINT,
    total_budget     DECIMAL(18, 2) NOT NULL,
    committed_spend  DECIMAL(18, 2) NOT NULL DEFAULT 0,
    actual_spend     DECIMAL(18, 2) NOT NULL DEFAULT 0,
    available_budget DECIMAL(18, 2) NOT NULL DEFAULT 0,
    period           VARCHAR(20)    NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_budget_dept FOREIGN KEY (department_id) REFERENCES department (id)
) ENGINE=InnoDB;

-- ── notification ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    title      VARCHAR(200) NOT NULL,
    message    TEXT,
    is_read    TINYINT(1)   NOT NULL DEFAULT 0,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

-- ── audit_log ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    user_id    BIGINT       NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id  BIGINT,
    action     VARCHAR(50)  NOT NULL,
    old_value  TEXT,
    new_value  TEXT,
    created_at DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_al_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

-- ── Indexes ───────────────────────────────────────────────
CREATE INDEX idx_request_employee   ON request          (employee_id);
CREATE INDEX idx_request_status     ON request          (status);
CREATE INDEX idx_request_approver   ON request          (current_approver_id);
CREATE INDEX idx_ra_request         ON request_approval (request_id);
CREATE INDEX idx_po_request         ON purchase_order   (request_id);
CREATE INDEX idx_po_supplier        ON purchase_order   (supplier_id);
CREATE INDEX idx_po_status          ON purchase_order   (status);
CREATE INDEX idx_payment_invoice    ON payment          (invoice_id);
CREATE INDEX idx_payment_status     ON payment          (status);
CREATE INDEX idx_notif_user_unread  ON notification     (user_id, is_read);
CREATE INDEX idx_audit_table_record ON audit_log        (table_name, record_id);
