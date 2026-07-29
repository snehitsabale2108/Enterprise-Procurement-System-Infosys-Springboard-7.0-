import { requests, formatCurrency } from '../../data/mockData';
import { Wrench, CheckCircle, Truck, ClipboardCheck, Eye, UserCheck, CreditCard } from 'lucide-react';

const FacilitiesWorkflow = () => {
  const facilityRequests = requests.filter(r => r.category === 'Facilities');
  const steps = [
    { label: 'Request Approved', icon: CheckCircle, status: 'completed' },
    { label: 'Vendor Selection', icon: Wrench, status: 'completed' },
    { label: 'Quotation', icon: ClipboardCheck, status: 'active' },
    { label: 'Purchase Order', icon: ClipboardCheck, status: 'pending' },
    { label: 'Delivery', icon: Truck, status: 'pending' },
    { label: 'Inspection', icon: Eye, status: 'pending' },
    { label: 'Handover', icon: UserCheck, status: 'pending' },
    { label: 'Finance', icon: CreditCard, status: 'pending' },
  ];

  return (
    <div className="page">
      <div className="page-header"><h1>Facilities Procurement</h1><p>Manage facility requests and vendor coordination</p></div>
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Workflow Pipeline</div>
        <div className="workflow-steps">
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div className={`workflow-step ${step.status}`}><div className="workflow-step-icon"><step.icon size={18} /></div><div className="workflow-step-label">{step.label}</div></div>
              {i < steps.length - 1 && <div className={`workflow-connector ${step.status === 'completed' ? 'completed' : ''}`} />}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Facility Requests</div>
        {facilityRequests.length === 0 ? (
          <div className="empty-state"><Wrench size={48} /><h3>No facility requests</h3></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>ID</th><th>Item</th><th>Qty</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>{facilityRequests.map(r => (<tr key={r.id}><td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td><td>{r.title}</td><td>{r.quantity}</td><td>{formatCurrency(r.estimatedCost)}</td><td><span className={`badge ${r.status === 'closed' ? 'badge-success' : 'badge-info'}`}>{r.status.replace(/_/g, ' ')}</span></td></tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilitiesWorkflow;
