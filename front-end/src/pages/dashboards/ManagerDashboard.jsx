import { requests, chartData, formatCurrency } from '../../data/mockData';
import { Clock, CheckCircle, XCircle, TrendingDown, IndianRupee } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const pendingRequests = requests.filter(r => r.status === 'pending_manager');

  const stats = [
    { label: 'Pending Approvals', value: pendingRequests.length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Approved This Month', value: 8, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Rejected This Month', value: 2, icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Total Spending', value: formatCurrency(1250000), icon: IndianRupee, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', isText: true },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Manager Dashboard</h1>
        <p>Review and approve team procurement requests</p>
      </div>

      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={s.isText ? { fontSize: 'var(--font-xl)' } : {}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">Approval Metrics</div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.approvalMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Line yAxisId="left" type="monotone" dataKey="avgDays" stroke="#f59e0b" strokeWidth={2} name="Avg Days" dot={{ fill: '#f59e0b' }} />
                <Line yAxisId="right" type="monotone" dataKey="approvalRate" stroke="#10b981" strokeWidth={2} name="Approval Rate %" dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">Department Spending</div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.departmentSpending} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                <YAxis type="category" dataKey="department" stroke="#94a3b8" fontSize={11} width={80} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} formatter={v => formatCurrency(v)} />
                <Bar dataKey="spent" fill="#6366f1" radius={[0, 4, 4, 0]} name="Spent" />
                <Bar dataKey="budget" fill="rgba(99,102,241,0.2)" radius={[0, 4, 4, 0]} name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Pending Approvals</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/approvals')}>View All</button>
        </div>
        {pendingRequests.length === 0 ? (
          <div className="empty-state"><CheckCircle size={48} /><h3>All caught up!</h3><p>No pending approvals</p></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Amount</th><th>Priority</th></tr></thead>
              <tbody>
                {pendingRequests.map(r => (
                  <tr key={r.id} onClick={() => navigate(`/requests/${r.id}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                    <td>{r.title}</td>
                    <td>{r.category}</td>
                    <td>{formatCurrency(r.estimatedCost)}</td>
                    <td><span className={`badge ${r.priority === 'high' ? 'badge-danger' : r.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{r.priority}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
