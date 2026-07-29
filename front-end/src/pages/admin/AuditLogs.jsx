import { useState } from 'react';
import { auditLogs, formatDateTime } from '../../data/mockData';
import { Search, ChevronDown, ChevronUp, History } from 'lucide-react';

const actionColors = {
  CREATE_REQUEST: 'badge-info', SUBMIT_REQUEST: 'badge-primary', APPROVE_REQUEST: 'badge-success',
  REJECT_REQUEST: 'badge-danger', CREATE_PO: 'badge-info', UPDATE_USER: 'badge-warning',
  PROCESS_PAYMENT: 'badge-success', CREATE_SUPPLIER: 'badge-info',
};

const AuditLogs = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const uniqueActions = [...new Set(auditLogs.map(l => l.action))].sort();
  const uniqueEntities = [...new Set(auditLogs.map(l => l.entity))].sort();

  const filtered = auditLogs.filter(l => {
    if (search && !l.userName.toLowerCase().includes(search.toLowerCase()) && !l.entityId.toLowerCase().includes(search.toLowerCase()) && !l.remarks.toLowerCase().includes(search.toLowerCase())) return false;
    if (actionFilter && l.action !== actionFilter) return false;
    if (entityFilter && l.entity !== entityFilter) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p>Complete system activity trail — {auditLogs.length} total entries</p>
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search by user, entity ID, or remarks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="">All Actions</option>
          {uniqueActions.map(a => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>
        <select className="form-select" value={entityFilter} onChange={e => setEntityFilter(e.target.value)}>
          <option value="">All Entities</option>
          {uniqueEntities.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th></th><th>User</th><th>Role</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>Timestamp</th><th>IP Address</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                <History size={32} style={{ marginBottom: 8, opacity: 0.5 }} /><br />No audit logs match your filters
              </td></tr>
            ) : filtered.map(log => (
              <>
                <tr key={log.id} style={{ cursor: 'pointer' }} onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                  <td style={{ width: 32, padding: '14px 8px 14px 16px' }}>
                    {expandedId === log.id ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                  </td>
                  <td style={{ fontWeight: 600 }}>{log.userName}</td>
                  <td><span className="badge badge-primary">{log.role.replace(/_/g, ' ')}</span></td>
                  <td><span className={`badge ${actionColors[log.action] || 'badge-neutral'}`}>{log.action.replace(/_/g, ' ')}</span></td>
                  <td>{log.entity}</td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--primary-light)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{log.entityId}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>{formatDateTime(log.timestamp)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                </tr>
                {expandedId === log.id && (
                  <tr key={`${log.id}-detail`}>
                    <td colSpan={8} style={{ background: 'var(--bg-surface)', padding: 'var(--space-md) var(--space-lg)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
                        <div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>REMARKS</div>
                          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{log.remarks}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>PREVIOUS VALUE</div>
                          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{log.previousValue || '—'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>UPDATED VALUE</div>
                          <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>{log.updatedValue || '—'}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
