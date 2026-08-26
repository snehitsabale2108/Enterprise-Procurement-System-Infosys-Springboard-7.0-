import { departments, purchaseOrders, suppliers, chartData, formatCurrency } from '../../data/mockData';
import { IndianRupee, TrendingUp, ShoppingCart, Building2, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

const HeadDashboard = () => {
  const totalBudget = departments.reduce((s, d) => s + d.budget, 0);
  const totalUsed = departments.reduce((s, d) => s + d.budgetUsed, 0);
  const utilization = Math.round((totalUsed / totalBudget) * 100);

  const stats = [
    { label: 'Total Procurement Spend', value: formatCurrency(totalUsed), icon: IndianRupee, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { label: 'Budget Remaining', value: formatCurrency(totalBudget - totalUsed), icon: TrendingUp, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Active Purchase Orders', value: purchaseOrders.filter(po => po.status !== 'closed').length, icon: ShoppingCart, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Active Suppliers', value: suppliers.filter(s => s.status === 'active').length, icon: Building2, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  ];

  const utilizationData = [{ name: 'Budget', value: utilization, fill: utilization > 80 ? '#ef4444' : utilization > 60 ? '#f59e0b' : '#10b981' }];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Executive Analytics</h1>
        <p>Company-wide procurement overview and budget tracking</p>
      </div>

      <div className="grid grid-4 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={24} color={s.color} /></div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ fontSize: typeof s.value === 'string' ? 'var(--font-xl)' : undefined }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-3 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card">
          <div className="card-header"><div className="card-title">Budget Utilization</div></div>
          <div className="chart-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={utilizationData} startAngle={180} endAngle={0}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'center', marginTop: '-60px' }}>
              <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: utilizationData[0].fill }}>{utilization}%</div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Budget Used</div>
            </div>
          </div>
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header"><div className="card-title">Monthly Spending Trend</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} formatter={v => formatCurrency(v)} />
                <Line type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} name="Spending" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-2 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="chart-card">
          <div className="card-header"><div className="card-title">Category Spending</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData.categoryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.categoryDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ color: "#000000", background: '#ffffff', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px' }} />
                <Legend wrapperStyle={{ color: '#ffffff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header"><div className="card-title">Supplier Performance</div></div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.supplierPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a3e', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '10px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Bar dataKey="onTime" fill="#10b981" radius={[4, 4, 0, 0]} name="On-Time %" />
                <Bar dataKey="rating" fill="#6366f1" radius={[4, 4, 0, 0]} name="Rating" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadDashboard;
