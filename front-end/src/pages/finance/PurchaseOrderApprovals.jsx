import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import {
  useEpsStore, getPurchaseOrdersForFinance, reviewPurchaseOrder, getRequest, TEAM_LABELS, poOwnerTeam,
} from '../../store/epsStore';
import { CheckCircle, XCircle, FileText, Clock } from 'lucide-react';

const TABS = [
  { key: 'pending_finance', label: 'Awaiting Finance Approval' },
  { key: 'finance_approved', label: 'Approved — With Procurement' },
  { key: 'finance_rejected', label: 'Rejected' },
  { key: 'sent', label: 'Issued to Supplier' },
];

/**
 * Finance approves purchase orders before they are handed back to the
 * procurement officer, who issues them to the supplier for processing.
 */
const PurchaseOrderApprovals = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEpsStore();

  const [tab, setTab] = useState('pending_finance');
  const [modal, setModal] = useState(null); // { po, approve }
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');

  const list = getPurchaseOrdersForFinance(tab);
  const pendingCount = getPurchaseOrdersForFinance('pending_finance').length;

  const openModal = (po, approve) => { setModal({ po, approve }); setComments(''); setError(''); };

  const confirm = () => {
    try {
      reviewPurchaseOrder(modal.po.id, { approve: modal.approve, comments, user: currentUser });
      setModal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Purchase Order Approvals</h1>
        <p>{pendingCount} purchase order(s) awaiting finance approval. Approved orders go back to the procurement officer, who issues them to the supplier.</p>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({getPurchaseOrdersForFinance(t.key).length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="empty-state">
          <Clock size={32} />
          <h3>Nothing here</h3>
          <p>No purchase orders in this state.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>PO</th><th>Supplier</th><th>Request</th><th>Owner Team</th>
                <th>Value</th><th>Status</th><th>Delivery</th><th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((po) => {
                const request = po.requestId ? getRequest(po.requestId) : null;
                const variance = request?.estimatedCost
                  ? Math.round(((po.totalAmount - request.estimatedCost) / request.estimatedCost) * 100)
                  : null;
                return (
                  <tr key={po.id} data-testid={`po-row-${po.id}`}>
                    <td style={{ fontWeight: 600 }}>{po.id}</td>
                    <td>{po.supplierName}</td>
                    <td>
                      <div>{request?.title || po.requestId}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{po.requestId}</div>
                    </td>
                    <td>{TEAM_LABELS[poOwnerTeam(po)]}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{formatCurrency(po.totalAmount)}</div>
                      {variance !== null && (
                        <div style={{ fontSize: 'var(--font-xs)', color: variance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                          {variance > 0 ? `+${variance}% over` : `${Math.abs(variance)}% under`} budget
                        </div>
                      )}
                    </td>
                    <td><span className={`badge ${getStatusBadgeClass(po.status)}`}>{getStatusLabel(po.status)}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(po.deliveryDate)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                        <button className="btn btn-ghost btn-sm" title="Open PO" onClick={() => navigate(`/purchase-orders/${po.id}`)}>
                          <FileText size={15} />
                        </button>
                        {po.status === 'pending_finance' && (
                          <>
                            <button className="btn btn-primary btn-sm" data-testid={`approve-po-${po.id}`} onClick={() => openModal(po, true)}>
                              <CheckCircle size={15} /> Approve
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => openModal(po, false)}>
                              <XCircle size={15} /> Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h2 className="modal-title">{modal.approve ? 'Approve' : 'Reject'} {modal.po.id}</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              {modal.approve
                ? `Approving hands ${modal.po.id} back to the procurement officer, who will issue it to ${modal.po.supplierName}.`
                : `Rejecting returns ${modal.po.id} to procurement for revision. The supplier is not notified.`}
            </p>
            <div className="form-group">
              <label className="form-label">Finance comments</label>
              <textarea className="form-input" rows={3} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="e.g. Within approved budget, payment terms 30 days" />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={confirm}>{modal.approve ? 'Approve Purchase Order' : 'Reject Purchase Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderApprovals;
