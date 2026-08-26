import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tenders, tenderBids, suppliers, formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { Plus, Search, Gavel, Clock, Users, IndianRupee, AlertTriangle } from 'lucide-react';

const TenderList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const isProcurement = ['procurement_officer', 'admin'].includes(currentUser?.role);

  const filtered = tenders.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    return true;
  });

  const getDeadlineInfo = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dl = new Date(deadline);
    const diff = dl - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return { text: 'Expired', urgent: true };
    if (days === 0) return { text: 'Today', urgent: true };
    if (days <= 3) return { text: `${days}d left`, urgent: true };
    return { text: `${days}d left`, urgent: false };
  };

  const getBidCount = (tenderId) => tenderBids.filter(b => b.tenderId === tenderId).length;

  const statCounts = {
    open: tenders.filter(t => t.status === 'open').length,
    evaluation: tenders.filter(t => t.status === 'evaluation').length,
    awarded: tenders.filter(t => t.status === 'awarded').length,
    total: tenders.length,
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Tenders</h1>
          <p>Manage procurement tenders and supplier bids</p>
        </div>
        {isProcurement && (
          <button className="btn btn-primary" onClick={() => navigate('/tenders/create')}>
            <Plus size={18} /> Create Tender
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Tenders', value: statCounts.total, color: 'var(--primary)', icon: Gavel },
          { label: 'Open', value: statCounts.open, color: 'var(--success)', icon: Clock },
          { label: 'Under Evaluation', value: statCounts.evaluation, color: 'var(--warning)', icon: Users },
          { label: 'Awarded', value: statCounts.awarded, color: 'var(--info)', icon: IndianRupee },
        ].map((s, i) => (
          <div key={i} className="stat-card" style={{ '--stat-color': s.color }}>
            <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
              <s.icon size={22} />
            </div>
            <div className="stat-content">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search tenders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="evaluation">Under Evaluation</option>
          <option value="awarded">Awarded</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Equipment & Assets">Equipment & Assets</option>
          <option value="Software & Digital Services">Software & Digital</option>
          <option value="Facilities">Facilities</option>
        </select>
      </div>

      {/* Tender Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tender ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Bids</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No tenders found</td></tr>
            ) : filtered.map(t => {
              const deadlineInfo = getDeadlineInfo(t.deadline);
              const bidCount = getBidCount(t.id);
              return (
                <tr key={t.id} onClick={() => navigate(`/tenders/${t.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{t.id}</td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                      Linked: {t.requestId}
                    </div>
                  </td>
                  <td><span className="badge badge-info">{t.category.split(' ')[0]}</span></td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(t.estimatedBudget)}</td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontWeight: 600, color: bidCount > 0 ? 'var(--success-light)' : 'var(--text-muted)' 
                    }}>
                      <Users size={14} /> {bidCount}
                    </span>
                  </td>
                  <td>
                    {deadlineInfo && (
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 'var(--font-sm)', fontWeight: 500,
                        color: deadlineInfo.urgent ? 'var(--danger-light)' : 'var(--text-secondary)'
                      }}>
                        {deadlineInfo.urgent && <AlertTriangle size={13} />}
                        {deadlineInfo.text}
                      </span>
                    )}
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                      {formatDate(t.deadline)}
                    </div>
                  </td>
                  <td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{getStatusLabel(t.status)}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenderList;
