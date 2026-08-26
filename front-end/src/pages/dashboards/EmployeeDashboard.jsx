import { useAuth } from '../../contexts/AuthContext';
import { requests, chartData, formatCurrency } from '../../data/mockData';
import { FileText, Clock, CheckCircle, XCircle, ShoppingBag, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const myRequests = requests.filter(r => r.createdBy === currentUser?.id);

  const stats = [
    { label: 'Total Requests', value: myRequests.length, icon: FileText, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Pending', value: myRequests.filter(r => r.status.startsWith('pending')).length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Approved', value: myRequests.filter(r => ['approved', 'in_procurement', 'delivered', 'closed'].includes(r.status)).length, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Rejected', value: myRequests.filter(r => r.status === 'rejected').length, icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  ];

  const getStatusBadge = (status) => {
    const map = { draft: 'badge-neutral', pending_manager: 'badge-warning', pending_senior_manager: 'badge-warning', pending_head: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger', in_procurement: 'badge-info', delivered: 'badge-primary', closed: 'badge-neutral' };
    const labels = { draft: 'Draft', pending_manager: 'Pending Manager', pending_senior_manager: 'Pending Sr. Mgr', pending_head: 'Pending Head', approved: 'Approved', rejected: 'Rejected', in_procurement: 'In Procurement', delivered: 'Delivered', closed: 'Closed' };
    return <span className={`badge ${map[status] || 'badge-neutral'}`}>{labels[status] || status}</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Welcome, {currentUser?.name?.split(' ')[0]}</h1>
        <p>Here's an overview of your procurement requests</p>
      </div>

      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color, animationDelay: `${i * 0.1}s` }}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={24} color={s.color} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">Monthly Requests</div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyRequests}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }}
                />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
                <Bar dataKey="rejected" fill="#ef4444" radius={[4, 4, 0, 0]} name="Rejected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <div className="card-title">Category Distribution</div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData.categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Requests</div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/requests/create')}>
            + New Request
          </button>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.slice(0, 5).map(r => (
                <tr key={r.id} onClick={() => navigate(`/requests/${r.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.category}</td>
                  <td>{formatCurrency(r.estimatedCost)}</td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
