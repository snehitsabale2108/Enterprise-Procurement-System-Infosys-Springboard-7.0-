import { Users } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function EmployeePage() {
  return (
    <RolePageShell
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
    >
      Add the employee component here.
    </RolePageShell>
  );
}
