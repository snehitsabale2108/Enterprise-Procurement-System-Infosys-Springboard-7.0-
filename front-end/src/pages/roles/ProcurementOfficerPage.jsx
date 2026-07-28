import { Handshake } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function ProcurementOfficerPage() {
  return (
    <RolePageShell
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
    >
      Add the procurement officer component here.
    </RolePageShell>
  );
}
