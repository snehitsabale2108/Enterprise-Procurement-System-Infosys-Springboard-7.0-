import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDateTime, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import {
  useEpsStore, getQuotationsForFinance, reviewQuotation, getRequest,
} from '../../store/epsStore';
import { CheckCircle, XCircle, FileText, IndianRupee, Clock } from 'lucide-react';

const TABS = [
  { key: 'pending_finance', label: 'Awaiting Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

/** Finance officer reviews supplier quotations before a vendor can be awarded. */
const QuotationApprovals = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEpsStore();

  const [tab, setTab] = useState('pending_finance');
  const [modal, setModal] = useState(null); // { quotation, approve }
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const list = getQuotationsForFinance(tab);
  const pendingCount = getQuotationsForFinance('pending_finance').length;

  const openModal = (quotation, approve) => {
    setModal({ quotation, approve });
    setComments('');
    setError('');
  };

  const confirm = () => {
    try {
      reviewQuotation(modal.quotation.id, {
        approve: modal.approve,
        comments,
        user: currentUser,
      });
      setModal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Quotation Approvals</h1>
        <p>{pendingCount} supplier quotation(s) awaiting finance approval</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({getQuotationsForFinance(t.key).length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={48} />
            <h3>Nothing here</h3>
            <p>No quotations in this state.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {list.map((q) => {
            const request = getRequest(q.requestId);
            const variance = request?.estimatedCost
              ? ((q.totalAmount - request.estimatedCost) / request.estimatedCost) * 100
              : null;
            return (
              <div key={q.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 260 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                      <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{q.id}</span>
                      <span className={`badge ${getStatusBadgeClass(q.financeStatus)}`}>{getStatusLabel(q.financeStatus)}</span>
                    </div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600 }}>{q.supplierName}</h3>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {request ? (
                        <button className="btn btn-ghost btn-sm" style={{ padding: 0 }} onClick={() => navigate(`/requests/${request.id}`)}>
                          {request.id} — {request.title}
                        </button>
                      ) : q.requestId}
                    </p>
                    <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', marginTop: 'var(--space-sm)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                      <span><Clock size={13} /> {q.estimatedDeliveryTime || '—'}</span>
                      <span>Warranty: {q.warranty || '—'}</span>
                      <span>Valid till: {q.validUntil || '—'}</span>
                      <span>Submitted: {formatDateTime(q.submittedAt)}</span>
                    </div>
                    {q.remarks && (
                      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 6 }}>{q.remarks}</p>
                    )}
                    {q.financeComments && (
                      <p style={{ fontSize: 'var(--font-sm)', marginTop: 6 }}>
                        <strong>Finance note:</strong> {q.financeComments} — {q.financeReviewedBy}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', minWidth: 200 }}>
                    <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>
                      <IndianRupee size={16} />{formatCurrency(q.totalAmount).replace('₹', '')}
                    </div>
                    {request && (
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                        Budget {formatCurrency(request.estimatedCost)}
                      </div>
                    )}
                    {variance !== null && (
                      <div
                        className={`badge ${variance > 0 ? 'badge-danger' : 'badge-success'}`}
                        style={{ marginTop: 6 }}
                      >
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}% vs budget
                      </div>
                    )}
                    {q.financeStatus === 'pending_finance' && (
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
                        <button className="btn btn-success btn-sm" onClick={() => openModal(q, true)}>
                          <CheckCircle size={14} /> Approve
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => openModal(q, false)}>
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{modal.approve ? 'Approve' : 'Reject'} Quotation {modal.quotation.id}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              {modal.approve
                ? 'Approving releases this quotation to the procurement officer for vendor selection.'
                : 'Rejecting removes this quotation from vendor selection. Please state the reason.'}
            </p>
            <div className="form-group">
              <label className="form-label">Comments {modal.approve ? '(optional)' : '*'}</label>
              <textarea className="form-textarea" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Finance remarks..." />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button
                className={`btn ${modal.approve ? 'btn-success' : 'btn-danger'}`}
                onClick={confirm}
                disabled={!modal.approve && !comments.trim()}
              >
                Confirm {modal.approve ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationApprovals;
