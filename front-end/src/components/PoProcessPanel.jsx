import { useState } from 'react';
import { CheckCircle, Truck } from 'lucide-react';
import { formatDateTime, getStatusBadgeClass, getStatusLabel } from '../data/mockData';
import {
  availablePoActions,
  canProcessPo,
  poOwnerTeam,
  poProgress,
  processPurchaseOrder,
  TEAM_LABELS,
} from '../store/epsStore';

/**
 * Purchase order processing controls. Only central procurement or the
 * department team designated for the PO's category (IT/software,
 * facilities, equipment) can move it along.
 */
const PoProcessPanel = ({ po, user, compact = false }) => {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const actions = availablePoActions(po, user);
  const allowed = canProcessPo(po, user);

  const run = (status) => {
    try {
      processPurchaseOrder(po.id, status, user, remarks);
      setRemarks('');
      setError('');
      setInfo(`${po.id} is now ${status.replace('_', ' ')}.`);
    } catch (err) {
      setError(err.message);
      setInfo('');
    }
  };

  return (
    <div className="card" data-testid="po-process-panel">
      <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
        <Truck size={16} /> Process Purchase Order
        <span className={`badge ${getStatusBadgeClass(po.status)}`}>{getStatusLabel(po.status)}</span>
      </div>

      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
        Owned by <strong>{TEAM_LABELS[poOwnerTeam(po)]}</strong>
      </p>

      {!compact && (
        <div className="workflow-steps" style={{ marginTop: 'var(--space-md)' }}>
          {poProgress(po).map((step, i) => (
            <div key={step.stage} style={{ display: 'contents' }}>
              {i > 0 && <div className="workflow-connector" />}
              <div className={`workflow-step ${step.current ? 'active' : ''} ${step.done ? 'completed' : ''}`}>
                <div className="workflow-step-icon">{step.done ? <CheckCircle size={14} /> : i + 1}</div>
                <div className="workflow-step-label">{step.stage.replace(/_/g, ' ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {info && <p style={{ fontSize: 'var(--font-sm)', color: 'var(--success)', marginTop: 'var(--space-md)' }}>{info}</p>}
      {error && <p data-testid="po-error" style={{ fontSize: 'var(--font-sm)', color: 'var(--danger)', marginTop: 'var(--space-md)' }}>{error}</p>}

      {!allowed ? (
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
          Your team is not designated to process this order.
        </p>
      ) : actions.length === 0 ? (
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
          No further processing steps for this order.
        </p>
      ) : (
        <>
          <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
            <label className="form-label">Processing remarks</label>
            <input
              className="form-input"
              placeholder="e.g. Dispatched via Blue Dart, AWB 12345"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            {actions.map((action) => (
              <button
                key={action.status}
                className={`btn btn-sm ${action.status === 'cancelled' ? 'btn-outline' : 'btn-primary'}`}
                data-testid={`po-action-${action.status}`}
                onClick={() => run(action.status)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}

      {po.history?.length > 0 && (
        <div style={{ marginTop: 'var(--space-lg)' }}>
          <div className="card-title" style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>Processing History</div>
          {po.history.map((h, i) => (
            <div key={i} style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 4 }}>
              <strong>{getStatusLabel(h.status)}</strong> — {h.by} ({h.role?.replace(/_/g, ' ')}) • {formatDateTime(h.at)}
              {h.remarks ? ` • ${h.remarks}` : ''}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoProcessPanel;
