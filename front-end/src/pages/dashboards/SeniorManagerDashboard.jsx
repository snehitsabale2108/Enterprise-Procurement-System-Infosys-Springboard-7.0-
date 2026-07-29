import { requests, chartData, departments, formatCurrency } from '../../data/mockData';
import { Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

const SeniorManagerDashboard = () => {
  const pending = requests.filter(r => r.status === 'pending_senior_manager');

  const stats = [
    { label: 'Pending Approvals', value: pending.length, icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Approved This Month', value: 12, icon: CheckCircle, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Escalated Requests', value: 3, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'Budget Utilization', value: '68%', icon: TrendingUp, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', isText: true },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Senior Manager Dashboard</h1>
        <p>Monitor department spending and manage escalations</p>
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
          <div className="card-header"><div className="card-title">Monthly Spending Trend</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.monthlySpending}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} formatter={v => formatCurrency(v)} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} name="Spending" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header"><div className="card-title">Department Budget vs Spent</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.departmentSpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="department" stroke="#94a3b8" fontSize={10} angle={-20} textAnchor="end" height={50} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} formatter={v => formatCurrency(v)} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Bar dataKey="budget" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="spent" fill="#6366f1" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Budget Overview</div></div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead><tr><th>Department</th><th>Budget</th><th>Spent</th><th>Remaining</th><th>Utilization</th></tr></thead>
            <tbody>
              {departments.map(d => {
                const pct = Math.round((d.budgetUsed / d.budget) * 100);
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.name}</td>
                    <td>{formatCurrency(d.budget)}</td>
                    <td>{formatCurrency(d.budgetUsed)}</td>
                    <td style={{ color: 'var(--success)' }}>{formatCurrency(d.budget - d.budgetUsed)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-surface)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct > 80 ? 'var(--danger)' : pct > 60 ? 'var(--warning)' : 'var(--success)', borderRadius: 3, transition: 'width 0.5s ease' }} />
                        </div>
                        <span style={{ fontSize: 'var(--font-xs)', color: pct > 80 ? 'var(--danger)' : 'var(--text-secondary)', fontWeight: 600 }}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SeniorManagerDashboard;
