import { useParams, useNavigate } from 'react-router-dom';
import { requests, approvalHistory, users, formatCurrency, formatDate, formatDateTime, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { ArrowLeft, Calendar, Tag, Hash, IndianRupee, Building2, User, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = requests.find(r => r.id === id);
  const history = approvalHistory.filter(h => h.requestId === id);
  const creator = users.find(u => u.id === request?.createdBy);

  if (!request) return <div className="page"><div className="empty-state"><h3>Request not found</h3></div></div>;

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

      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-lg)' }}>Approval History</div>
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No approval actions yet</p>
        ) : (
          <div className="timeline">
            {history.map((h, i) => (
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
    </div>
  );
};

export default RequestDetail;
