import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { requests, users, formatCurrency, getStatusLabel } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RotateCcw, MessageSquare } from 'lucide-react';

const ApprovalQueue = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [comments, setComments] = useState('');
  const [action, setAction] = useState('');

  const statusMap = { manager: 'pending_manager', senior_manager: 'pending_senior_manager', head: 'pending_head' };
  const pendingStatus = statusMap[currentUser?.role];
  const pendingRequests = requests.filter(r => r.status === pendingStatus);

  const handleAction = (requestId, act) => {
    setShowModal(requestId);
    setAction(act);
    setComments('');
  };

  const confirmAction = () => {
    const req = requests.find(r => r.id === showModal);
    if (req) {
      if (action === 'approve') {
        const next = { pending_manager: req.estimatedCost > 50000 ? 'pending_senior_manager' : 'approved', pending_senior_manager: req.estimatedCost > 200000 ? 'pending_head' : 'approved', pending_head: 'approved' };
        req.status = next[req.status] || 'approved';
      } else if (action === 'reject') {
        req.status = 'rejected';
      } else {
        req.status = 'draft';
      }
    }
    setShowModal(null);
    alert(`Request ${action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'returned'} successfully!`);
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
          {pendingRequests.map(r => {
            const creator = users.find(u => u.id === r.createdBy);
            return (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ flex: 1, minWidth: 200, cursor: 'pointer' }} onClick={() => navigate(`/requests/${r.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{r.id}</span>
                    <span className={`badge ${r.priority === 'high' ? 'badge-danger' : r.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{r.priority}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 4 }}>{r.title}</h3>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    by {creator?.name || 'Unknown'} • {r.category} • {formatCurrency(r.estimatedCost)}
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
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{action === 'approve' ? 'Approve' : action === 'reject' ? 'Reject' : 'Return'} Request</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Comments {action !== 'approve' ? '*' : '(optional)'}</label>
              <textarea className="form-textarea" placeholder={`Add ${action} comments...`} value={comments} onChange={e => setComments(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(null)}>Cancel</button>
              <button className={`btn ${action === 'approve' ? 'btn-success' : action === 'reject' ? 'btn-danger' : 'btn-warning'}`} onClick={confirmAction}>
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
