import { Building2 } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function HeadPage() {
  return (
    <RolePageShell
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
    >
      Add the head component here.
    </RolePageShell>
  );
}
