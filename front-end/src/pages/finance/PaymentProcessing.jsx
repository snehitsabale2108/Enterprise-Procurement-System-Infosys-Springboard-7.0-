import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import {
  useEpsStore, getPayments, getPayment, getPaymentSummary, availablePaymentActions,
  canProcessPayments, verifyInvoice, releasePayment, confirmPayment, updatePaymentStatus,
  getAuditTrail, PAYMENT_METHODS, PAYMENT_STAGE_ORDER, paymentProgress,
} from '../../store/epsStore';
import AuditTrail from '../../components/AuditTrail';
import { Wallet, ShieldCheck, Send, CheckCircle, PauseCircle, XCircle, Search } from 'lucide-react';

const TABS = [
  { key: 'pending', label: 'Awaiting Verification' },
  { key: 'verified', label: 'Ready to Pay' },
  { key: 'processing', label: 'In Process' },
  { key: 'paid', label: 'Paid' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'failed', label: 'Failed' },
  { key: 'all', label: 'All' },
];

const CHECKS = [
  { key: 'poVerified', label: 'PO matches' },
  { key: 'grnVerified', label: 'GRN received' },
  { key: 'invoiceVerified', label: 'Invoice matches' },
  { key: 'taxVerified', label: 'Tax / GST verified' },
  { key: 'amountVerified', label: 'Amount verified' },
];

const emptyChecks = () => CHECKS.reduce((acc, c) => ({ ...acc, [c.key]: false }), {});

/**
 * Finance payment processing: three-way match verification, release of funds
 * to the supplier and settlement confirmation — every step audited.
 */
const PaymentProcessing = () => {
  const { currentUser } = useAuth();
  useEpsStore();

  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [modal, setModal] = useState(null); // { payment, status }
  const [checks, setChecks] = useState(emptyChecks());
  const [method, setMethod] = useState('NEFT');
  const [reference, setReference] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const allowed = canProcessPayments(currentUser);
  const summary = getPaymentSummary();
  const list = getPayments({ status: tab, search });
  const selected = selectedId ? getPayment(selectedId) : null;

  const openModal = (payment, status) => {
    setModal({ payment, status });
    setChecks(emptyChecks());
    setMethod(payment.paymentMethod || 'NEFT');
    setReference(payment.referenceNumber || '');
    setTransactionId('');
    setRemarks('');
    setError('');
  };

  const submit = () => {
    const { payment, status } = modal;
    try {
      if (status === 'verified') {
        verifyInvoice(payment.id, { checks, remarks, user: currentUser });
        setToast(`${payment.id} verified — ready for release.`);
      } else if (status === 'processing') {
        releasePayment(payment.id, { paymentMethod: method, referenceNumber: reference, remarks, user: currentUser });
        setToast(`${payment.id} released via ${method}.`);
      } else if (status === 'paid') {
        confirmPayment(payment.id, { transactionId, remarks, user: currentUser });
        setToast(`${payment.id} settled.`);
      } else {
        updatePaymentStatus(payment.id, status, { remarks, user: currentUser });
        setToast(`${payment.id} moved to ${getStatusLabel(status)}.`);
      }
      setModal(null);
      setTimeout(() => setToast(''), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  const actionIcon = (status) => {
    if (status === 'verified') return <ShieldCheck size={14} />;
    if (status === 'processing') return <Send size={14} />;
    if (status === 'paid') return <CheckCircle size={14} />;
    if (status === 'on_hold') return <PauseCircle size={14} />;
    return <XCircle size={14} />;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Payment Processing</h1>
        <p>Verify invoices, release supplier payments and confirm settlements.</p>
      </div>

      {toast && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)' }}>{toast}</div>}
      {!allowed && (
        <div className="alert alert-warning" style={{ marginBottom: 'var(--space-md)' }}>
          You have read-only access — only the finance team can process payments.
        </div>
      )}

      <div className="stats-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="stat-card">
          <div className="stat-label">Awaiting Verification</div>
          <div className="stat-value">{summary.pending.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ready to Pay</div>
          <div className="stat-value">{summary.verified.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Outstanding Payable</div>
          <div className="stat-value">{formatCurrency(summary.payableAmount)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Paid To Date</div>
          <div className="stat-value">{formatCurrency(summary.paidAmount)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({getPayments({ status: t.key }).length})
          </button>
        ))}
      </div>

      <div className="login-input-wrapper" style={{ position: 'relative', maxWidth: 320, marginBottom: 'var(--space-md)' }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: 12, color: 'var(--text-muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search payment, PO, supplier, reference…"
          style={{ paddingLeft: 30, width: '100%' }}
        />
      </div>

      {list.length === 0 ? (
        <div className="empty-state"><Wallet size={32} /><h3>No payments here</h3></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Payment</th><th>PO</th><th>Supplier</th><th>Amount</th><th>Method</th>
                <th>Reference</th><th>Status</th><th>Paid Date</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedId(p.id === selectedId ? null : p.id)}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.id}</td>
                  <td>{p.poNumber}</td>
                  <td>{p.supplierName}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
                  <td>{p.paymentMethod || '—'}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{p.referenceNumber || '—'}</td>
                  <td><span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{formatDate(p.paidDate)}</td>
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'inline-flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {availablePaymentActions(p, currentUser).map((a) => (
                        <button
                          key={a.status}
                          className={`btn btn-sm ${a.status === 'paid' ? 'btn-success' : a.status === 'processing' ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => openModal(p, a.status)}
                        >
                          {actionIcon(a.status)} {a.label}
                        </button>
                      ))}
                      {!availablePaymentActions(p, currentUser).length && (
                        <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div style={{ marginTop: 'var(--space-lg)', display: 'grid', gap: 'var(--space-md)' }}>
          <div className="card">
            <div className="card-title">{selected.id} — {selected.supplierName}</div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginTop: 'var(--space-sm)' }}>
              {paymentProgress(selected).map((step) => (
                <span
                  key={step.stage}
                  className={`badge ${step.current ? 'badge-primary' : step.done ? 'badge-success' : 'badge-neutral'}`}
                >
                  {getStatusLabel(step.stage)}
                </span>
              ))}
              <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>
                ({PAYMENT_STAGE_ORDER.length} stage lifecycle)
              </span>
            </div>
            <div style={{ marginTop: 'var(--space-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-sm)', fontSize: 'var(--font-sm)' }}>
              <div><strong>Invoice:</strong> {selected.invoiceNumber || '—'}</div>
              <div><strong>Amount:</strong> {formatCurrency(selected.amount)}</div>
              <div><strong>Verified by:</strong> {selected.verifiedByName || selected.verifiedBy || '—'}</div>
              <div><strong>Transaction:</strong> {selected.transactionId || '—'}</div>
            </div>
          </div>
          <AuditTrail entries={getAuditTrail(selected.id)} title={`Audit Trail — ${selected.id}`} />
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modal.status === 'verified' && 'Verify Invoice'}
                {modal.status === 'processing' && 'Release Payment'}
                {modal.status === 'paid' && 'Confirm Settlement'}
                {modal.status === 'on_hold' && 'Put Payment On Hold'}
                {modal.status === 'failed' && 'Mark Payment Failed'}
                {modal.status === 'pending' && 'Reopen Payment'}
              </h3>
            </div>
            <div className="modal-body" style={{ display: 'grid', gap: 'var(--space-md)' }}>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                {modal.payment.id} • {modal.payment.poNumber} • {modal.payment.supplierName} •{' '}
                <strong>{formatCurrency(modal.payment.amount)}</strong>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              {modal.status === 'verified' && (
                <div style={{ display: 'grid', gap: 6 }}>
                  <label style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>Three-way match (all required)</label>
                  {CHECKS.map((c) => (
                    <label key={c.key} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 'var(--font-sm)' }}>
                      <input
                        type="checkbox"
                        checked={checks[c.key]}
                        onChange={(e) => setChecks({ ...checks, [c.key]: e.target.checked })}
                      />
                      {c.label}
                    </label>
                  ))}
                </div>
              )}

              {modal.status === 'processing' && (
                <>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={method} onChange={(e) => setMethod(e.target.value)}>
                      {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bank Reference (optional — generated if blank)</label>
                    <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="NEFT-20240412-001" />
                  </div>
                </>
              )}

              {modal.status === 'paid' && (
                <div className="form-group">
                  <label>Transaction / UTR Number (optional)</label>
                  <input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="TXN-HDFC-..." />
                </div>
              )}

              <div className="form-group">
                <label>Remarks</label>
                <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Notes for the audit trail" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={submit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;
