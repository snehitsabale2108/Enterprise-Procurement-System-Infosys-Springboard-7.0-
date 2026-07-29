import { requests, purchaseOrders, chartData, formatCurrency } from '../../data/mockData';
import { CheckCircle, FileText, ShoppingCart, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const ProcurementDashboard = () => {
  const navigate = useNavigate();
  const approvedReqs = requests.filter(r => r.status === 'approved' || r.status === 'in_procurement');

  const stats = [
    { label: 'Approved Requests', value: approvedReqs.length, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Pending POs', value: purchaseOrders.filter(po => po.status === 'draft' || po.status === 'sent').length, icon: FileText, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Active POs', value: purchaseOrders.filter(po => po.status === 'accepted').length, icon: ShoppingCart, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Completed', value: purchaseOrders.filter(po => po.status === 'closed').length, icon: Package, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Procurement Dashboard</h1>
        <p>Manage procurement operations and supplier coordination</p>
      </div>

      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} color={s.color} /></div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card">
          <div className="card-header"><div className="card-title">Monthly Orders</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.monthlyRequests}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
                <Bar dataKey="requests" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Requests" />
                <Bar dataKey="approved" fill="#10b981" radius={[4, 4, 0, 0]} name="Approved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header"><div className="card-title">Supplier Comparison</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={chartData.supplierPerformance}>
                <PolarGrid stroke="rgba(148,163,184,0.1)" />
                <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis stroke="#94a3b8" fontSize={10} />
                <Radar name="On-Time %" dataKey="onTime" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Radar name="Rating" dataKey="rating" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Approved Requests — Ready for Procurement</div>
        </div>
        {approvedReqs.length === 0 ? (
          <div className="empty-state"><Package size={48} /><h3>No pending requests</h3></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Amount</th><th>Action</th></tr></thead>
              <tbody>
                {approvedReqs.map(r => (
                  <tr key={r.id}>
                    <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                    <td>{r.title}</td>
                    <td>{r.category}</td>
                    <td>{formatCurrency(r.estimatedCost)}</td>
                    <td><button className="btn btn-primary btn-sm" onClick={() => navigate(`/requests/${r.id}`)}>Process</button></td>
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

export default ProcurementDashboard;
