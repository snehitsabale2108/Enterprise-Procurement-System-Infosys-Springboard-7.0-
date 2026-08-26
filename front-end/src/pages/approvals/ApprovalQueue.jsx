import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { users, formatCurrency, formatDate } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import {
  useEpsStore, approveRequest, rejectRequest, returnRequest, statusForLevel,
  approvalLevelsFor,
} from '../../store/epsStore';
import { requests } from '../../data/mockData';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const ApprovalQueue = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEpsStore();

  const [showModal, setShowModal] = useState(null);
  const [comments, setComments] = useState('');
  const [action, setAction] = useState('');
  const [error, setError] = useState('');

  const pendingStatus = statusForLevel(currentUser?.role);
  const pendingRequests = requests.filter((r) => r.status === pendingStatus);

  const handleAction = (requestId, act) => {
    setShowModal(requestId);
    setAction(act);
    setComments('');
    setError('');
  };

  const confirmAction = () => {
    try {
      if (action === 'approve') approveRequest(showModal, currentUser, comments || 'Approved.');
      else if (action === 'reject') rejectRequest(showModal, currentUser, comments);
      else returnRequest(showModal, currentUser, comments);
      setShowModal(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Approval Queue</h1>
        <p>{pendingRequests.length} request(s) pending your approval</p>
      </div>

      {pendingRequests.length === 0 ? (
        <div className="card"><div className="empty-state"><CheckCircle size={48} /><h3>All caught up!</h3><p>No requests pending your approval</p></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {pendingRequests.map((r) => {
            const creator = users.find((u) => u.id === r.createdBy);
            const levels = approvalLevelsFor(r.estimatedCost);
            const step = levels.indexOf(currentUser?.role) + 1;
            return (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ flex: 1, minWidth: 200, cursor: 'pointer' }} onClick={() => navigate(`/requests/${r.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{r.id}</span>
                    <span className={`badge ${r.priority === 'high' ? 'badge-danger' : r.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{r.priority}</span>
                    <span className="badge badge-info">Level {step} of {levels.length}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 4 }}>{r.title}</h3>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    by {creator?.name || 'Unknown'} • {r.category} • {formatCurrency(r.estimatedCost)} • needed by {formatDate(r.requiredDate)}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleAction(r.id, 'approve')}><CheckCircle size={14} /> Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleAction(r.id, 'reject')}><XCircle size={14} /> Reject</button>
                  <button className="btn btn-warning btn-sm" onClick={() => handleAction(r.id, 'return')}><RotateCcw size={14} /> Return</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Return'} Request</h3>
            </div>
            {action === 'return' && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                The requester will be notified and can edit and resubmit this request.
              </p>
            )}
            <div className="form-group">
              <label className="form-label">Comments {action !== 'approve' ? '*' : '(optional)'}</label>
              <textarea className="form-textarea" placeholder={`Add ${action} comments...`} value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
              <button
                className={`btn ${action === 'approve' ? 'btn-success' : action === 'reject' ? 'btn-danger' : 'btn-warning'}`}
                onClick={confirmAction}
                disabled={action !== 'approve' && !comments.trim()}
              >
                Confirm {action.charAt(0).toUpperCase() + action.slice(1)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalQueue;
