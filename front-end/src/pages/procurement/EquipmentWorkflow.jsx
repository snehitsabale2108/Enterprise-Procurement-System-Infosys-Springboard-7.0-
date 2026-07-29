import { requests, purchaseOrders, formatCurrency } from '../../data/mockData';
import { Monitor, CheckCircle, Package, Truck, FileCheck, UserCheck, CreditCard, ClipboardCheck } from 'lucide-react';

const EquipmentWorkflow = () => {
  const equipmentRequests = requests.filter(r => r.category === 'Equipment & Assets' && (r.status === 'approved' || r.status === 'in_procurement' || r.status === 'delivered'));
  const steps = [
    { label: 'Request Approved', icon: CheckCircle, status: 'completed' },
    { label: 'Supplier Selection', icon: Package, status: 'completed' },
    { label: 'Quotation', icon: ClipboardCheck, status: 'completed' },
    { label: 'Purchase Order', icon: FileCheck, status: 'active' },
    { label: 'Delivery', icon: Truck, status: 'pending' },
    { label: 'Verification & GRN', icon: Monitor, status: 'pending' },
    { label: 'Employee Handover', icon: UserCheck, status: 'pending' },
    { label: 'Finance', icon: CreditCard, status: 'pending' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Equipment Procurement</h1>
        <p>Manage equipment acquisition workflow</p>
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Workflow Pipeline</div>
        <div className="workflow-steps">
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className={`workflow-step ${step.status}`}>
                <div className="workflow-step-icon"><step.icon size={18} /></div>
                <div className="workflow-step-label">{step.label}</div>
              </div>
              {i < steps.length - 1 && <div className={`workflow-connector ${step.status === 'completed' ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Equipment Requests</div>
        {equipmentRequests.length === 0 ? (
          <div className="empty-state"><Monitor size={48} /><h3>No equipment requests</h3></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>ID</th><th>Item</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {equipmentRequests.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                    <td>{r.title}</td>
                    <td>{r.quantity}</td>
                    <td>{formatCurrency(r.estimatedCost)}</td>
                    <td><span className={`badge ${r.status === 'delivered' ? 'badge-success' : 'badge-info'}`}>{r.status.replace(/_/g, ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentWorkflow;
