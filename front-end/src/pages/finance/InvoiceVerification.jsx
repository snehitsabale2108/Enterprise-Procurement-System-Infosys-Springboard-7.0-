import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import {
  useEpsStore, getPayments, verifyInvoice, canProcessPayments,
} from '../../store/epsStore';
import { CheckCircle, FileCheck, Shield, ShieldAlert } from 'lucide-react';

const CHECKS = [
  { key: 'poVerified', label: 'PO Verified' },
  { key: 'grnVerified', label: 'GRN Verified' },
  { key: 'invoiceVerified', label: 'Invoice Match' },
  { key: 'taxVerified', label: 'Tax Verified' },
  { key: 'amountVerified', label: 'Amount Verified' },
];

const emptyChecks = () => CHECKS.reduce((acc, c) => ({ ...acc, [c.key]: false }), {});

/**
 * Three-way match screen — finance ticks every check before an invoice is
 * approved for payment. Nothing can be approved with a check outstanding.
 */
const InvoiceVerification = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEpsStore();

  const [checksByPayment, setChecksByPayment] = useState({});
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const allowed = canProcessPayments(currentUser);
  const pendingPayments = getPayments({ status: 'pending' })
    .concat(getPayments({ status: 'on_hold' }));

  const checksFor = (id) => checksByPayment[id] || emptyChecks();
  const toggle = (id, key, value) =>
    setChecksByPayment({ ...checksByPayment, [id]: { ...checksFor(id), [key]: value } });

  const verify = (payment) => {
    setError('');
    try {
      verifyInvoice(payment.id, { checks: checksFor(payment.id), user: currentUser });
      setToast(`${payment.id} verified — ready for release in Payment Processing.`);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setError(`${payment.id}: ${err.message}`);
    }
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Invoice Verification</h1><p>Run the three-way match before releasing supplier payments</p></div>
        <button className="btn btn-primary" onClick={() => navigate('/finance/payments')}>View All Payments</button>
      </div>

      {toast && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)' }}>{toast}</div>}
      {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-md)' }}>{error}</div>}
      {!allowed && (
        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-md)' }}>
          Read-only view — only the finance team can verify invoices.
        </div>
      )}

      {pendingPayments.length === 0 ? (
        <div className="card"><div className="empty-state"><CheckCircle size={48} /><h3>All invoices verified</h3></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {pendingPayments.map((p) => {
            const checks = checksFor(p.id);
            const complete = CHECKS.every((c) => checks[c.key]);
            return (
              <div key={p.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{p.id}</span>
                      <span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span>
                    </div>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {p.supplierName} • PO: {p.poNumber} • Invoice: {p.invoiceNumber || '—'}
                    </p>
                  </div>
                  <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(p.amount)}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-sm)' }}>
                  {CHECKS.map((c) => (
                    <label
                      key={c.key}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px',
                        background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-xs)', fontWeight: 500, cursor: allowed ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <input
                        type="checkbox"
                        disabled={!allowed}
                        checked={!!checks[c.key]}
                        onChange={(e) => toggle(p.id, c.key, e.target.checked)}
                      />
                      {checks[c.key] ? <Shield size={12} color="var(--success)" /> : <ShieldAlert size={12} color="var(--warning)" />}
                      {c.label}
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', alignItems: 'center' }}>
                  {!complete && (
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                      All five checks are required before approval.
                    </span>
                  )}
                  <button className="btn btn-success btn-sm" disabled={!allowed || !complete} onClick={() => verify(p)}>
                    <FileCheck size={14} /> Verify &amp; Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceVerification;
