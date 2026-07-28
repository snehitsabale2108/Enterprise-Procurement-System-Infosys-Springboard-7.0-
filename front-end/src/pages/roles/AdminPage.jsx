import { ShieldCheck } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function AdminPage() {
  return (
    <RolePageShell
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
    >
      Add the admin component here.
    </RolePageShell>
  );
}
