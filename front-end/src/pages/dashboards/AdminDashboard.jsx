import { users, roles, departments, categories, suppliers, auditLogs } from '../../data/mockData';
import { Users, Shield, Building2, FolderKanban, Truck, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Users', value: users.length, icon: Users, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', to: '/admin/users' },
    { label: 'Roles', value: roles.length, icon: Shield, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)', to: '/admin/roles' },
    { label: 'Departments', value: departments.length, icon: Building2, color: '#10b981', bg: 'rgba(16,185,129,0.1)', to: '/admin/departments' },
    { label: 'Categories', value: categories.length, icon: FolderKanban, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', to: '/admin/categories' },
    { label: 'Suppliers', value: suppliers.length, icon: Truck, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', to: '/suppliers' },
    { label: 'Audit Logs', value: auditLogs.length, icon: History, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', to: '/admin/audit-logs' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System administration and configuration</p>
      </div>

      <div className="grid grid-3 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color, cursor: 'pointer' }} onClick={() => navigate(s.to)}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} color={s.color} /></div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Audit Logs</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/audit-logs')}>View All</button>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead><tr><th>User</th><th>Role</th><th>Action</th><th>Entity</th><th>Timestamp</th></tr></thead>
            <tbody>
              {auditLogs.slice(0, 6).map(log => (
                <tr key={log.id}>
                  <td style={{ fontWeight: 600 }}>{log.userName}</td>
                  <td><span className="badge badge-primary">{log.role.replace(/_/g, ' ')}</span></td>
                  <td>{log.action.replace(/_/g, ' ')}</td>
                  <td>{log.entity} ({log.entityId})</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(log.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
