import { payments, chartData, formatCurrency } from '../../data/mockData';
import { Clock, CheckCircle, IndianRupee, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Pending Invoices', value: payments.filter(p => p.status === 'pending').length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Processing', value: payments.filter(p => p.status === 'processing' || p.status === 'approved').length, icon: AlertTriangle, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Paid Invoices', value: payments.filter(p => p.status === 'paid').length, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Total Paid', value: formatCurrency(payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0)), icon: IndianRupee, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Finance Dashboard</h1>
        <p>Invoice verification and payment processing</p>
      </div>

      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} color={s.color} /></div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={typeof s.value === 'string' ? { fontSize: 'var(--font-xl)' } : {}}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header"><div className="card-title">Payment Trend (Paid vs Pending)</div></div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.paymentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} formatter={v => formatCurrency(v)} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              <Bar dataKey="paid" fill="#10b981" radius={[4, 4, 0, 0]} name="Paid" />
              <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">All Payments</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/finance/payments')}>Process Payments</button>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead><tr><th>ID</th><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.id}</td>
                  <td>{p.poNumber}</td>
                  <td>{p.supplierName}</td>
                  <td>{formatCurrency(p.amount)}</td>
                  <td>{p.paymentMethod || '—'}</td>
                  <td><span className={`badge ${p.status === 'paid' ? 'badge-success' : p.status === 'pending' ? 'badge-warning' : 'badge-info'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
