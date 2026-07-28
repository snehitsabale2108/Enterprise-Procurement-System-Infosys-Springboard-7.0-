import { BriefcaseBusiness } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function SeniorManagerPage() {
  return (
    <RolePageShell
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
    >
      Add the senior manager component here.
    </RolePageShell>
  );
}
