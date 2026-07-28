import { Truck } from "lucide-react";
import RolePageShell from "../../components/RolePageShell";

export default function SupplierPage() {
  return (
    <RolePageShell
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
    >
      Add the supplier component here.
    </RolePageShell>
  );
}
