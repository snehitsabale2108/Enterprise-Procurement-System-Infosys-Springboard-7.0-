import { requests, softwareLicenses, formatCurrency } from '../../data/mockData';
import { Code, Key, CheckCircle, Search, ShoppingBag, Zap, UserCheck } from 'lucide-react';

const SoftwareWorkflow = () => {
  const softwareRequests = requests.filter(r => r.category === 'Software & Digital Services');
  const steps = [
    { label: 'Request Approved', icon: CheckCircle, status: 'completed' },
    { label: 'Check Licenses', icon: Search, status: 'completed' },
    { label: 'Purchase / Assign', icon: ShoppingBag, status: 'active' },
    { label: 'Activation', icon: Zap, status: 'pending' },
    { label: 'Employee Access', icon: UserCheck, status: 'pending' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Software Procurement</h1>
        <p>Manage software licenses and subscriptions</p>
      </div>

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

      <div className="grid grid-2 gap-lg">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>License Inventory</div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>Software</th><th>Seats</th><th>Used</th><th>Expiry</th><th>Status</th></tr></thead>
              <tbody>
                {softwareLicenses.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td>{l.totalSeats}</td>
                    <td>{l.usedSeats}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(l.expiryDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 5, background: 'var(--bg-surface)', borderRadius: 3 }}>
                          <div style={{ width: `${(l.usedSeats / l.totalSeats) * 100}%`, height: '100%', background: (l.usedSeats / l.totalSeats) > 0.8 ? 'var(--danger)' : 'var(--success)', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{Math.round((l.usedSeats / l.totalSeats) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Software Requests</div>
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>ID</th><th>Software</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {softwareRequests.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                    <td>{r.title}</td>
                    <td>{formatCurrency(r.estimatedCost)}</td>
                    <td><span className={`badge ${r.status === 'closed' ? 'badge-success' : 'badge-info'}`}>{r.status.replace(/_/g, ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoftwareWorkflow;
