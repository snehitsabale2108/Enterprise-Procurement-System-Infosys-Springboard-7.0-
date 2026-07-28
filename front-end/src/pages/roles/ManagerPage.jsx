import { UserCog } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function ManagerPage() {
  return (
    <RolePageShell
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
    >
      Add the manager component here.
    </RolePageShell>
  );
}
