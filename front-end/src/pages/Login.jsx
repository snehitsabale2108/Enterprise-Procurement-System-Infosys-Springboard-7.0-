import { useEffect, useMemo, useState } from "react";
import {
  LogIn,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Landmark,
  Handshake,
  Building2,
  UserCog,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";
import { getRoleLabel, normalizeRole, useAuth } from "../context/AuthContext";

function formatLoginError(detail) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          return item.msg ?? item.message ?? JSON.stringify(item);
        }

        return String(item);
      })
      .join(" ");
  }

  if (detail && typeof detail === "object") {
    return detail.detail ?? detail.message ?? JSON.stringify(detail);
  }

  return "Unable to sign in. Check your credentials and try again.";
}

const roleCards = [
  {
    role: "employee",
    icon: Users,
    title: "Employee",
    description: "Personal work queue and requests.",
  },
  {
    role: "manager",
    icon: UserCog,
    title: "Manager",
    description: "Team oversight and approvals.",
  },
  {
    role: "senior-manager",
    icon: BriefcaseBusiness,
    title: "Senior Manager",
    description: "Cross-team decisions and escalations.",
  },
  {
    role: "head",
    icon: Building2,
    title: "Head",
    description: "Department leadership and policy.",
  },
  {
    role: "procurement-officer",
    icon: Handshake,
    title: "Procurement Officer",
    description: "Sourcing, bids, and vendor follow-up.",
  },
  {
    role: "finance",
    icon: Landmark,
    title: "Finance",
    description: "Budget checks and payment approvals.",
  },
  {
    role: "admin",
    icon: ShieldCheck,
    title: "Admin",
    description: "Access control and system settings.",
  },
  {
    role: "supplier",
    icon: Truck,
    title: "Supplier",
    description: "Submission status and order updates.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, role, getRolePath } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeRoleLabel = useMemo(() => getRoleLabel(role), [role]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getRolePath(role), { replace: true });
    }
  }, [getRolePath, isAuthenticated, navigate, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login/", {
        email,
        password,
      });

      login(response.data);

      const nextRole = normalizeRole(
        response.data.role ?? response.data.user?.role,
      );
      const destination = getRolePath(nextRole);
      toast.success(`Signed in as ${getRoleLabel(nextRole)}`);
      navigate(destination, { replace: true });
    } catch (loginError) {
      const message = formatLoginError(
        loginError?.response?.data?.detail ?? loginError?.response?.data,
      );
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-4xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur xl:grid-cols-[1.15fr_0.85fr]">
          <section className="relative overflow-hidden p-8 sm:p-10 lg:p-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />
            <div className="relative">
              <p className="mb-4 inline-flex rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                ProcurementMS
              </p>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Role-based login for every workspace.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Sign in once and get redirected to the right area based on your
                role.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {roleCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <article
                      key={card.role}
                      className="flex gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300"
                    >
                      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                        <Icon size={18} />
                      </span>
                      <div>
                        <h2 className="font-semibold text-white">
                          {card.title}
                        </h2>
                        <p className="mt-1 leading-6">{card.description}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-t border-white/10 bg-slate-900/80 p-8 sm:p-10 lg:border-t-0 lg:border-l lg:p-14">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Access portal
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                Welcome back{activeRoleLabel ? `, ${activeRoleLabel}` : ""}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your credentials to continue to your assigned dashboard.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-4 focus:ring-cyan-400/10"
                />
              </label>

              {error ? (
                <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={loading}
              >
                <LogIn size={16} />
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
