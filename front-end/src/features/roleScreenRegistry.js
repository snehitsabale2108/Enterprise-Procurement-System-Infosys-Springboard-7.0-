import {
  AdminPage,
  EmployeePage,
  FinancePage,
  HeadPage,
  ManagerPage,
  ProcurementOfficerPage,
  SeniorManagerPage,
  SupplierPage,
} from "../pages/roles";

export const ROLE_SCREEN_REGISTRY = {
  employee: EmployeePage,
  manager: ManagerPage,
  "senior-manager": SeniorManagerPage,
  head: HeadPage,
  "procurement-officer": ProcurementOfficerPage,
  finance: FinancePage,
  admin: AdminPage,
  supplier: SupplierPage,
};

export const ROLE_SCREEN_ROLES = Object.keys(ROLE_SCREEN_REGISTRY);
