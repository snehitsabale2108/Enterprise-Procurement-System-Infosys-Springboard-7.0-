import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Handshake,
  Landmark,
  LogOut,
  ShieldCheck,
  Truck,
  UserCog,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRoleLabel, normalizeRole, useAuth } from "../context/AuthContext";

function RoleScreenShell({
  role,
  title,
  subtitle,
  icon: Icon,
  stats,
  highlights,
}) {
  const { logout, getRolePath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const routeTarget = getRolePath(role);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-between overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Signed in as {getRoleLabel(role)}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {subtitle}
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
              type="button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <Icon size={22} />
              </span>
              <div>
                <strong className="block text-base text-white">{title}</strong>
                <p className="text-sm text-slate-400">
                  Route target: {routeTarget}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Quick highlights
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-slate-200">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-slate-900/60 p-5"
              >
                <span className="block text-sm text-slate-400">
                  {stat.label}
                </span>
                <strong className="mt-3 block text-3xl font-semibold tracking-tight text-white">
                  {stat.value}
                </strong>
              </article>
            ))}
          </div>

          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-sm leading-7 text-cyan-50">
            This is temporary UI for {getRoleLabel(role)}. Replace the content
            inside this component without changing the route or auth logic.
          </div>
        </div>
      </section>
    </main>
  );
}

function EmployeeScreen() {
  return (
    <RoleScreenShell
      role="employee"
      title="Employee Workspace"
      subtitle="Track assigned work, requests, and approvals."
      icon={Users}
      stats={[
        { label: "Open tasks", value: "08" },
        { label: "Pending approvals", value: "03" },
        { label: "SLA health", value: "96%" },
      ]}
      highlights={[
        { label: "Current lane", value: "Daily assignments" },
        { label: "Primary action", value: "Submit status updates" },
      ]}
    />
  );
}

function ManagerScreen() {
  return (
    <RoleScreenShell
      role="manager"
      title="Manager Workspace"
      subtitle="Review team activity and approve procurement steps."
      icon={UserCog}
      stats={[
        { label: "Team requests", value: "14" },
        { label: "Escalations", value: "02" },
        { label: "Budget used", value: "71%" },
      ]}
      highlights={[
        { label: "Current lane", value: "Team oversight" },
        { label: "Primary action", value: "Approve workflow items" },
      ]}
    />
  );
}

function SeniorManagerScreen() {
  return (
    <RoleScreenShell
      role="senior-manager"
      title="Senior Manager Workspace"
      subtitle="Handle escalations and cross-team decisions."
      icon={BriefcaseBusiness}
      stats={[
        { label: "High priority items", value: "05" },
        { label: "Cross-team reviews", value: "11" },
        { label: "Risk flags", value: "02" },
      ]}
      highlights={[
        { label: "Current lane", value: "Escalation review" },
        { label: "Primary action", value: "Resolve blockers" },
      ]}
    />
  );
}

function HeadScreen() {
  return (
    <RoleScreenShell
      role="head"
      title="Head Workspace"
      subtitle="Own policy, budget direction, and governance."
      icon={Building2}
      stats={[
        { label: "Department approvals", value: "09" },
        { label: "Policy items", value: "04" },
        { label: "Open escalations", value: "01" },
      ]}
      highlights={[
        { label: "Current lane", value: "Department control" },
        { label: "Primary action", value: "Review governance" },
      ]}
    />
  );
}

function ProcurementOfficerScreen() {
  return (
    <RoleScreenShell
      role="procurement-officer"
      title="Procurement Officer Workspace"
      subtitle="Run sourcing, bids, and vendor follow-up."
      icon={Handshake}
      stats={[
        { label: "Vendors in review", value: "12" },
        { label: "Open RFQs", value: "06" },
        { label: "Bid windows", value: "03" },
      ]}
      highlights={[
        { label: "Current lane", value: "Vendor sourcing" },
        { label: "Primary action", value: "Manage RFQs" },
      ]}
    />
  );
}

function FinanceScreen() {
  return (
    <RoleScreenShell
      role="finance"
      title="Finance Workspace"
      subtitle="Validate budget, cost centres, and payments."
      icon={Landmark}
      stats={[
        { label: "Budget checks", value: "18" },
        { label: "Pending invoices", value: "07" },
        { label: "Payment holds", value: "02" },
      ]}
      highlights={[
        { label: "Current lane", value: "Budget validation" },
        { label: "Primary action", value: "Review payments" },
      ]}
    />
  );
}

function AdminScreen() {
  return (
    <RoleScreenShell
      role="admin"
      title="Admin Workspace"
      subtitle="Manage users, roles, and platform access."
      icon={ShieldCheck}
      stats={[
        { label: "Active users", value: "248" },
        { label: "Roles assigned", value: "08" },
        { label: "System alerts", value: "01" },
      ]}
      highlights={[
        { label: "Current lane", value: "Access control" },
        { label: "Primary action", value: "Manage permissions" },
      ]}
    />
  );
}

function SupplierScreen() {
  return (
    <RoleScreenShell
      role="supplier"
      title="Supplier Workspace"
      subtitle="Monitor submissions, orders, and status updates."
      icon={Truck}
      stats={[
        { label: "Open orders", value: "16" },
        { label: "Invoices to send", value: "04" },
        { label: "Delivery status", value: "On time" },
      ]}
      highlights={[
        { label: "Current lane", value: "Order tracking" },
        { label: "Primary action", value: "Update shipment status" },
      ]}
    />
  );
}

const ROLE_SCREEN_REGISTRY = {
  employee: EmployeeScreen,
  manager: ManagerScreen,
  "senior-manager": SeniorManagerScreen,
  head: HeadScreen,
  "procurement-officer": ProcurementOfficerScreen,
  finance: FinanceScreen,
  admin: AdminScreen,
  supplier: SupplierScreen,
};

export const ROLE_SCREEN_ROLES = Object.keys(ROLE_SCREEN_REGISTRY);

export function getRoleScreen(role) {
  const normalizedRole = normalizeRole(role);

  return ROLE_SCREEN_REGISTRY[normalizedRole] ?? null;
}

export default ROLE_SCREEN_REGISTRY;
