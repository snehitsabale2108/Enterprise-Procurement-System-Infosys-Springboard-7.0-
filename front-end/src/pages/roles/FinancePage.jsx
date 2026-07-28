import { Landmark } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function FinancePage() {
  return (
    <RolePageShell
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
    >
      Add the finance component here.
    </RolePageShell>
  );
}
