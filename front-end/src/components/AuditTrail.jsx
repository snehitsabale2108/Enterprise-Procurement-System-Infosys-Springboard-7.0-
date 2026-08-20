import { History } from 'lucide-react';
import { formatDateTime } from '../data/mockData';
import { useEpsStore } from '../store/epsStore';

const ACTION_BADGES = {
  CREATE_REQUEST: 'badge-info',
  UPDATE_REQUEST: 'badge-warning',
  SUBMIT_REQUEST: 'badge-primary',
  RESUBMIT_REQUEST: 'badge-primary',
  APPROVE_REQUEST: 'badge-success',
  REJECT_REQUEST: 'badge-danger',
  RETURN_REQUEST: 'badge-warning',
  CANCEL_REQUEST: 'badge-danger',
  CREATE_RFQ: 'badge-info',
  SUBMIT_QUOTATION: 'badge-info',
  APPROVE_QUOTATION: 'badge-success',
  REJECT_QUOTATION: 'badge-danger',
  SELECT_VENDOR: 'badge-primary',
  CREATE_PO: 'badge-info',
  PROCESS_PO: 'badge-primary',
  PROCESS_PO_REJECTED: 'badge-danger',
  ASSIGN_ROLE: 'badge-primary',
  CREATE_USER: 'badge-info',
  UPDATE_USER: 'badge-warning',
  UPDATE_USER_STATUS: 'badge-warning',
};

/**
 * Append-only audit trail for one entity (request, purchase order…).
 * Shows actor, role, before → after values and remarks.
 */
const AuditTrail = ({ entries, title = 'Audit Trail' }) => {
  useEpsStore();
  const list = entries || [];

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
        <History size={16} /> {title} ({list.length})
      </div>
      {list.length === 0 ? (
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>No activity recorded yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {list.map((entry) => (
            <div
              key={entry.id}
              data-testid="audit-entry"
              style={{ borderLeft: '2px solid var(--border)', paddingLeft: 'var(--space-md)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span className={`badge ${ACTION_BADGES[entry.action] || 'badge-info'}`}>
                  {entry.action.replace(/_/g, ' ')}
                </span>
                <strong style={{ fontSize: 'var(--font-sm)' }}>{entry.userName}</strong>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                  {entry.role?.replace(/_/g, ' ')} • {entry.entity} {entry.entityId} • {formatDateTime(entry.timestamp)}
                </span>
              </div>
              {(entry.previousValue || entry.updatedValue) && (
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                  {entry.previousValue || '—'} → <strong>{entry.updatedValue || '—'}</strong>
                </div>
              )}
              {entry.remarks && (
                <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>{entry.remarks}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuditTrail;
