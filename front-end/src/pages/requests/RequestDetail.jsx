import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  requests, users, tenders,
  formatCurrency, formatDate, formatDateTime, getStatusBadgeClass, getStatusLabel
} from '../../data/mockData';
import { getApprovalHistory, cancelRequest } from '../../services/requestService';
import { approveRequest, rejectRequest, returnRequest } from '../../services/approvalService';
import {
  ArrowLeft, Calendar, Tag, Hash, IndianRupee, Building2, User,
  CheckCircle, XCircle, RotateCcw, Gavel, Plus, MessageSquare
} from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [comments, setComments] = useState('');
  const [currentHistory, setCurrentHistory] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [, forceRefresh] = useState(0);

  const request = requests.find(r => r.id === id);
  const creator = users.find(u => u.id === request?.createdBy);

  const loadHistory = async () => {
    const h = await getApprovalHistory(id);
    setCurrentHistory(h || []);
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!request) return <div className="page"><div className="empty-state"><h3>Request not found</h3></div></div>;

  const role = currentUser?.role;

  // Determine if current user can approve/reject/return this request
  const statusMap = { manager: 'pending_manager', senior_manager: 'pending_senior_manager', head: 'pending_head' };
  const canApprove = ['manager', 'senior_manager', 'head'].includes(role) && request.status === statusMap[role];

  // Determine if current user can create a tender
  const isProcurement = ['procurement_officer', 'admin'].includes(role);
  const existingTender = tenders.find(t => t.requestId === id);
  const canCreateTender = isProcurement && request.status === 'approved' && !existingTender;

  // Determine if current user can cancel (only creator + draft/pending)
  const isCreator = currentUser?.id === request.createdBy;
  const canCancel = isCreator && ['draft', 'pending_manager'].includes(request.status);

  const openActionModal = (type) => {
    setActionType(type);
    setComments('');
    setShowActionModal(true);
  };

  const confirmAction = async () => {
    setSubmitting(true);
    try {
      if (actionType === 'approve') {
        await approveRequest(id, comments || 'Approved from request detail page.', role);
      } else if (actionType === 'reject') {
        await rejectRequest(id, comments, role);
      } else if (actionType === 'return') {
        await returnRequest(id, comments, role);
      } else if (actionType === 'cancel') {
        await cancelRequest(id);
      }
      setShowActionModal(false);
      await loadHistory();
      forceRefresh(n => n + 1); // re-render to reflect the updated request.status
      alert(`Request ${actionType === 'approve' ? 'approved' : actionType === 'reject' ? 'rejected' : actionType === 'return' ? 'returned' : 'cancelled'} successfully!`);
    } catch (err) {
      alert(err.message || 'Action failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const details = [
    { icon: Hash, label: 'Request ID', value: request.id },
    { icon: Tag, label: 'Category', value: `${request.category} → ${request.subcategory}` },
    { icon: IndianRupee, label: 'Estimated Cost', value: formatCurrency(request.estimatedCost) },
    { icon: Hash, label: 'Quantity', value: request.quantity },
    { icon: Building2, label: 'Department', value: request.department },
    { icon: Calendar, label: 'Required Date', value: formatDate(request.requiredDate) },
    { icon: User, label: 'Requested By', value: creator?.name || request.createdBy },
    { icon: Calendar, label: 'Created', value: formatDate(request.createdAt) },
  ];

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{request.title}</h1>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', alignItems: 'center' }}>
            <span className={`badge ${getStatusBadgeClass(request.status)}`}>{getStatusLabel(request.status)}</span>
            <span className={`badge ${request.priority === 'high' ? 'badge-danger' : request.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{request.priority} priority</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
          {canApprove && (
            <>
              <button className="btn btn-success btn-sm" onClick={() => openActionModal('approve')}>
                <CheckCircle size={14} /> Approve
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => openActionModal('reject')}>
                <XCircle size={14} /> Reject
              </button>
              <button className="btn btn-warning btn-sm" onClick={() => openActionModal('return')}>
                <RotateCcw size={14} /> Return
              </button>
            </>
          )}
          {canCreateTender && (
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/tenders/create')}>
              <Gavel size={14} /> Create Tender
            </button>
          )}
          {existingTender && isProcurement && (
            <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/tenders/${existingTender.id}`)}>
              <Gavel size={14} /> View Tender
            </button>
          )}
          {canCancel && (
            <button className="btn btn-danger btn-sm" onClick={() => openActionModal('cancel')}>
              <XCircle size={14} /> Cancel Request
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Request Details</div>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {details.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <d.icon size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', minWidth: 120 }}>{d.label}</span>
                <span style={{ fontSize: 'var(--font-base)', fontWeight: 500 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Description</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{request.description}</p>
          {request.reason && (
            <>
              <div className="card-title" style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-sm)' }}>Justification</div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{request.reason}</p>
            </>
          )}
        </div>
      </div>

      {/* Linked Tender Info */}
      {existingTender && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)', borderLeft: '3px solid var(--primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                <Gavel size={16} /> Linked Tender
              </div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                {existingTender.id} — {existingTender.title}
              </p>
            </div>
            <span className={`badge ${getStatusBadgeClass(existingTender.status)}`}>{getStatusLabel(existingTender.status)}</span>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Approval History</div>
        {currentHistory.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No approval actions yet</p>
        ) : (
          <div className="timeline">
            {currentHistory.map((h, i) => (
              <div key={h.id} className="timeline-item">
                <div className={`timeline-dot ${h.action === 'approved' ? 'completed' : h.action === 'rejected' ? 'rejected' : 'active'}`} />
                <div className="timeline-content">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    {h.action === 'approved' ? <CheckCircle size={14} color="var(--success)" /> : h.action === 'rejected' ? <XCircle size={14} color="var(--danger)" /> : <RotateCcw size={14} color="var(--warning)" />}
                    {h.approverName}
                    <span className={`badge ${h.action === 'approved' ? 'badge-success' : h.action === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>{h.action}</span>
                  </h4>
                  <p style={{ marginTop: 4 }}>{h.comments}</p>
                  <span className="time">{formatDateTime(h.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && (
        <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {actionType === 'approve' ? '✅ Approve' : actionType === 'reject' ? '❌ Reject' : actionType === 'return' ? '↩️ Return' : '🚫 Cancel'} Request
              </h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              {actionType === 'approve' && 'Approve this procurement request and forward it to the next level.'}
              {actionType === 'reject' && 'Reject this procurement request. Please provide a reason.'}
              {actionType === 'return' && 'Return this request to the requester for corrections.'}
              {actionType === 'cancel' && 'Cancel this request. This action cannot be undone.'}
            </p>
            <div className="form-group">
              <label className="form-label">
                Comments {actionType !== 'approve' && actionType !== 'cancel' ? '*' : '(optional)'}
              </label>
              <textarea
                className="form-textarea"
                placeholder={`Add ${actionType} comments...`}
                value={comments}
                onChange={e => setComments(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" disabled={submitting} onClick={() => setShowActionModal(false)}>Cancel</button>
              <button
                className={`btn ${actionType === 'approve' ? 'btn-success' : actionType === 'reject' || actionType === 'cancel' ? 'btn-danger' : 'btn-warning'}`}
                onClick={confirmAction}
                disabled={submitting || (['reject', 'return'].includes(actionType) && !comments.trim())}
              >
                Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetail;
