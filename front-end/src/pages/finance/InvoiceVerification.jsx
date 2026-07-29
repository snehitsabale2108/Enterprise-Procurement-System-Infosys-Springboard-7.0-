import { payments, formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { CheckCircle, FileCheck, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InvoiceVerification = () => {
  const navigate = useNavigate();
  const pendingPayments = payments.filter(p => p.status === 'pending' || p.status === 'processing');

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Invoice Verification</h1><p>Verify invoices and process payments</p></div>
        <button className="btn btn-primary" onClick={() => navigate('/finance/payments')}>View All Payments</button>
      </div>

      {pendingPayments.length === 0 ? (
        <div className="card"><div className="empty-state"><CheckCircle size={48} /><h3>All invoices verified</h3></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {pendingPayments.map(p => (
            <div key={p.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{p.id}</span>
                    <span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{p.supplierName} • PO: {p.poNumber}</p>
                </div>
                <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--space-sm)' }}>
                {['PO Verified', 'GRN Verified', 'Invoice Match', 'Tax Verified', 'Amount Verified'].map((check, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-xs)', fontWeight: 500 }}>
                    <Shield size={12} color="var(--success)" />{check}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
                <button className="btn btn-success btn-sm" onClick={() => alert('Invoice verified!')}><FileCheck size={14} /> Verify & Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvoiceVerification;
