import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tenders, tenderBids, suppliers, formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { Gavel, Clock, CheckCircle, FileText, IndianRupee, Calendar, AlertTriangle, Package } from 'lucide-react';

const SupplierTenders = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tenders');

  const supplierId = currentUser?.supplierId;
  const supplierInfo = suppliers.find(s => s.id === supplierId);

  // Tenders this supplier is invited to
  const invitedTenders = tenders.filter(t => t.invitedSuppliers.includes(supplierId));
  const myBids = tenderBids.filter(b => b.supplierId === supplierId);

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

  const statCounts = {
    invited: invitedTenders.filter(t => t.status === 'open').length,
    bidSubmitted: myBids.filter(b => b.status === 'submitted' || b.status === 'under_review').length,
    won: myBids.filter(b => b.status === 'accepted').length,
    total: invitedTenders.length,
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tender Portal</h1>
        <p>Welcome, {supplierInfo?.companyName || currentUser?.name}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Total Invitations', value: statCounts.total, color: 'var(--primary)', icon: Gavel },
          { label: 'Open Tenders', value: statCounts.invited, color: 'var(--success)', icon: Clock },
          { label: 'Active Bids', value: statCounts.bidSubmitted, color: 'var(--warning)', icon: FileText },
          { label: 'Won', value: statCounts.won, color: 'var(--info)', icon: CheckCircle },
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

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${activeTab === 'tenders' ? 'active' : ''}`} onClick={() => setActiveTab('tenders')}>
          Available Tenders ({invitedTenders.length})
        </button>
        <button className={`tab ${activeTab === 'bids' ? 'active' : ''}`} onClick={() => setActiveTab('bids')}>
          My Bids ({myBids.length})
        </button>
      </div>

      {/* Available Tenders Tab */}
      {activeTab === 'tenders' && (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {invitedTenders.length === 0 ? (
            <div className="card"><div className="empty-state"><Gavel size={48} /><h3>No tenders</h3><p>You haven't been invited to any tenders yet</p></div></div>
          ) : invitedTenders.map(t => {
            const deadlineInfo = getDeadlineInfo(t.deadline);
            const existingBid = myBids.find(b => b.tenderId === t.id);
            const isWinner = t.awardedSupplierId === supplierId;
            return (
              <div key={t.id} className="card" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: 'var(--space-md)',
                borderLeft: isWinner ? '3px solid var(--success)' : 'none',
              }}>
                <div style={{ flex: 1, minWidth: 250, cursor: 'pointer' }} onClick={() => navigate(`/tenders/${t.id}`)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{t.id}</span>
                    <span className={`badge ${getStatusBadgeClass(t.status)}`}>{getStatusLabel(t.status)}</span>
                    {isWinner && <span className="badge badge-success">🏆 Won</span>}
                  </div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 4 }}>{t.title}</h3>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    {t.category} • Budget: {formatCurrency(t.estimatedBudget)} • Qty: {t.quantity}
                  </p>
                  {deadlineInfo && (
                    <div style={{ 
                      marginTop: 'var(--space-sm)', fontSize: 'var(--font-xs)',
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: deadlineInfo.urgent ? 'var(--danger-light)' : 'var(--text-muted)'
                    }}>
                      <Calendar size={12} /> Deadline: {formatDate(t.deadline)}
                      {deadlineInfo.urgent && <> • <AlertTriangle size={12} /> {deadlineInfo.text}</>}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                  {existingBid ? (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 2 }}>Your bid</div>
                      <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{formatCurrency(existingBid.totalAmount)}</div>
                      <span className={`badge ${getStatusBadgeClass(existingBid.status)}`}>{getStatusLabel(existingBid.status)}</span>
                    </div>
                  ) : t.status === 'open' ? (
                    <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); navigate(`/supplier/tenders/${t.id}/bid`); }}>
                      <Gavel size={14} /> Submit Bid
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* My Bids Tab */}
      {activeTab === 'bids' && (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {myBids.length === 0 ? (
            <div className="card"><div className="empty-state"><FileText size={48} /><h3>No bids</h3><p>You haven't submitted any bids yet</p></div></div>
          ) : myBids.map(bid => {
            const tender = tenders.find(t => t.id === bid.tenderId);
            return (
              <div key={bid.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/tenders/${bid.tenderId}`)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-light)', fontSize: 'var(--font-sm)' }}>{bid.id}</span>
                      <span className={`badge ${getStatusBadgeClass(bid.status)}`}>{getStatusLabel(bid.status)}</span>
                    </div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 4 }}>{tender?.title || bid.tenderId}</h3>
                    <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                      {bid.items.map(item => item.name).join(', ')} • {bid.deliveryDays} days delivery
                    </p>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                      Submitted: {formatDate(bid.submittedAt)} • Valid until: {formatDate(bid.validUntil)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(bid.totalAmount)}
                    </div>
                    {tender && (
                      <div style={{ fontSize: 'var(--font-xs)', color: bid.totalAmount <= tender.estimatedBudget ? 'var(--success-light)' : 'var(--danger-light)', marginTop: 2 }}>
                        {bid.totalAmount <= tender.estimatedBudget ? 'Within budget' : 'Over budget'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SupplierTenders;
