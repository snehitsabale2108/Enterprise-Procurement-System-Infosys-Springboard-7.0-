import { Navigate, useNavigate } from "react-router-dom";
import {
  LogOut,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Landmark,
  Handshake,
  Building2,
  UserCog,
  Truck,
} from "lucide-react";
import { getRoleLabel, normalizeRole, useAuth } from "../context/AuthContext";

const dashboardCopy = {
  employee: {
    title: "Employee Workspace",
    subtitle: "Track assigned work, requests, and approvals.",
    icon: Users,
    stats: [
      { label: "Open tasks", value: "08" },
      { label: "Pending approvals", value: "03" },
      { label: "SLA health", value: "96%" },
    ],
  },
  manager: {
    title: "Manager Workspace",
    subtitle: "Review team activity and approve procurement steps.",
    icon: UserCog,
    stats: [
      { label: "Team requests", value: "14" },
      { label: "Escalations", value: "02" },
      { label: "Budget used", value: "71%" },
    ],
  },
  "senior-manager": {
    title: "Senior Manager Workspace",
    subtitle: "Handle escalations and cross-team decisions.",
    icon: BriefcaseBusiness,
    stats: [
      { label: "High priority items", value: "05" },
      { label: "Cross-team reviews", value: "11" },
      { label: "Risk flags", value: "02" },
    ],
  },
  head: {
    title: "Head Workspace",
    subtitle: "Own policy, budget direction, and governance.",
    icon: Building2,
    stats: [
      { label: "Department approvals", value: "09" },
      { label: "Policy items", value: "04" },
      { label: "Open escalations", value: "01" },
    ],
  },
  "procurement-officer": {
    title: "Procurement Officer Workspace",
    subtitle: "Run sourcing, bids, and vendor follow-up.",
    icon: Handshake,
    stats: [
      { label: "Vendors in review", value: "12" },
      { label: "Open RFQs", value: "06" },
      { label: "Bid windows", value: "03" },
    ],
  },
  finance: {
    title: "Finance Workspace",
    subtitle: "Validate budget, cost centres, and payments.",
    icon: Landmark,
    stats: [
      { label: "Budget checks", value: "18" },
      { label: "Pending invoices", value: "07" },
      { label: "Payment holds", value: "02" },
    ],
  },
  admin: {
    title: "Admin Workspace",
    subtitle: "Manage users, roles, and platform access.",
    icon: ShieldCheck,
    stats: [
      { label: "Active users", value: "248" },
      { label: "Roles assigned", value: "08" },
      { label: "System alerts", value: "01" },
    ],
  },
  supplier: {
    title: "Supplier Workspace",
    subtitle: "Monitor submissions, orders, and status updates.",
    icon: Truck,
    stats: [
      { label: "Open orders", value: "16" },
      { label: "Invoices to send", value: "04" },
      { label: "Delivery status", value: "On time" },
    ],
  },
};

export default function RoleDashboard() {
  const { role, user, logout, getRolePath } = useAuth();
  const navigate = useNavigate();
  const normalizedRole = normalizeRole(role);

  if (!normalizedRole || !dashboardCopy[normalizedRole]) {
    return <Navigate to="/login" replace />;
  }

  const copy = dashboardCopy[normalizedRole];
  const Icon = copy.icon;
  const displayName =
    user?.name ?? user?.fullName ?? user?.email ?? getRoleLabel(normalizedRole);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col justify-between overflow-hidden rounded-4xlborder border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Signed in as {getRoleLabel(normalizedRole)}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                {copy.subtitle}
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

          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <Icon size={22} />
            </span>
            <div>
              <strong className="block text-base text-white">
                {displayName}
              </strong>
              <p className="text-sm text-slate-400">
                Route target: {getRolePath(normalizedRole)}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {copy.stats.map((stat) => (
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
        </div>
      </section>
    </main>
  );
}
