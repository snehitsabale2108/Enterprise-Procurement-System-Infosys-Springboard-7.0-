import { requests, formatCurrency, getStatusLabel } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';

const ProcurementQueue = () => {
  const navigate = useNavigate();
  const approvedReqs = requests.filter(r => r.status === 'approved' || r.status === 'in_procurement');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Procurement Queue</h1>
        <p>Approved requests ready for procurement processing</p>
      </div>

      {approvedReqs.length === 0 ? (
        <div className="card"><div className="empty-state"><Package size={48} /><h3>No pending requests</h3><p>All approved requests have been processed</p></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {approvedReqs.map(r => (
            <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</span>
                  <span className="badge badge-info">{r.category.split(' ')[0]}</span>
                </div>
                <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600 }}>{r.title}</h3>
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {r.department} • Qty: {r.quantity} • {formatCurrency(r.estimatedCost)}
                </p>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/requests/${r.id}`)}>
                Process <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProcurementQueue;
