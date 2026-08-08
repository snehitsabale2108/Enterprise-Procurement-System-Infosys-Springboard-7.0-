import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  tenders, tenderBids, suppliers, requests, users,
  formatCurrency, formatDate, formatDateTime, getStatusBadgeClass, getStatusLabel
} from '../../data/mockData';
import {
  ArrowLeft, Calendar, Tag, Hash, IndianRupee, Building2, User, FileText,
  Clock, CheckCircle, XCircle, Award, Ban, Gavel, Truck, Star, ShieldCheck
} from 'lucide-react';

const TenderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedBidId, setSelectedBidId] = useState('');
  const [awardComments, setAwardComments] = useState('');

  const tender = tenders.find(t => t.id === id);
  const bids = tenderBids.filter(b => b.tenderId === id);
  const linkedRequest = tender ? requests.find(r => r.id === tender.requestId) : null;

  if (!tender) return <div className="page"><div className="empty-state"><h3>Tender not found</h3></div></div>;

  const isProcurement = ['procurement_officer', 'admin'].includes(currentUser?.role);
  const isSupplier = currentUser?.role === 'supplier';
  const supplierCompany = isSupplier ? suppliers.find(s => s.id === currentUser.supplierId) : null;
  const myBid = isSupplier ? bids.find(b => b.supplierId === currentUser.supplierId) : null;

  const invitedSuppliersList = tender.invitedSuppliers.map(sid => suppliers.find(s => s.id === sid)).filter(Boolean);

  const handleCloseBidding = () => {
    tender.status = 'evaluation';
    tender.closedAt = new Date().toISOString();
    alert('Tender closed for evaluation!');
    navigate(`/tenders/${id}`);
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this tender?')) {
      tender.status = 'cancelled';
      alert('Tender cancelled');
      navigate('/tenders');
    }
  };

  const handleAward = () => {
    if (!selectedBidId) return alert('Please select a bid to award');
    const bid = tenderBids.find(b => b.id === selectedBidId);
    if (bid) {
      tender.status = 'awarded';
      tender.awardedBidId = selectedBidId;
      tender.awardedSupplierId = bid.supplierId;
      bid.status = 'accepted';
      tenderBids.filter(b => b.tenderId === id && b.id !== selectedBidId).forEach(b => { b.status = 'rejected'; });
    }
    setShowAwardModal(false);
    alert('Tender awarded successfully!');
  };

  const details = [
    { icon: Hash, label: 'Tender ID', value: tender.id },
    { icon: FileText, label: 'Linked Request', value: tender.requestId, link: `/requests/${tender.requestId}` },
    { icon: Tag, label: 'Category', value: tender.category },
    { icon: Hash, label: 'Quantity', value: tender.quantity },
    { icon: IndianRupee, label: 'Estimated Budget', value: formatCurrency(tender.estimatedBudget) },
    { icon: Calendar, label: 'Deadline', value: formatDate(tender.deadline) },
    { icon: Calendar, label: 'Published', value: formatDate(tender.publishedAt) },
    { icon: User, label: 'Created By', value: users.find(u => u.id === tender.createdBy)?.name || tender.createdBy },
  ];

  return (
    <div className="page" style={{ maxWidth: 1100 }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>{tender.title}</h1>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', alignItems: 'center' }}>
            <span className={`badge ${getStatusBadgeClass(tender.status)}`}>{getStatusLabel(tender.status)}</span>
            {tender.awardedSupplierId && (
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--success-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={14} /> Awarded to {suppliers.find(s => s.id === tender.awardedSupplierId)?.companyName}
              </span>
            )}
          </div>
        </div>
        {/* Actions */}
        {isProcurement && (
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {tender.status === 'open' && (
              <button className="btn btn-warning btn-sm" onClick={handleCloseBidding}>
                <Clock size={14} /> Close Bidding
              </button>
            )}
            {tender.status === 'evaluation' && (
              <button className="btn btn-success btn-sm" onClick={() => setShowAwardModal(true)}>
                <Award size={14} /> Award Tender
              </button>
            )}
            {['open', 'evaluation'].includes(tender.status) && (
              <button className="btn btn-danger btn-sm" onClick={handleCancel}>
                <Ban size={14} /> Cancel
              </button>
            )}
          </div>
        )}
        {isSupplier && tender.status === 'open' && !myBid && (
          <button className="btn btn-primary" onClick={() => navigate(`/supplier/tenders/${id}/bid`)}>
            <Gavel size={18} /> Submit Bid
          </button>
        )}
      </div>

      {/* Detail + Description Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Tender Details</div>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {details.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <d.icon size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', minWidth: 130 }}>{d.label}</span>
                {d.link ? (
                  <span style={{ fontSize: 'var(--font-base)', fontWeight: 500, color: 'var(--primary-light)', cursor: 'pointer' }} onClick={() => navigate(d.link)}>{d.value}</span>
                ) : (
                  <span style={{ fontSize: 'var(--font-base)', fontWeight: 500 }}>{d.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Description & Specifications</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-lg)' }}>{tender.description}</p>
          <div className="card-title" style={{ marginBottom: 'var(--space-sm)', fontSize: 'var(--font-sm)' }}>Specifications</div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--font-sm)', background: 'var(--bg-surface)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            {tender.specifications}
          </p>
        </div>
      </div>

      {/* Invited Suppliers */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Building2 size={18} /> Invited Suppliers ({invitedSuppliersList.length})
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
          {invitedSuppliersList.map(s => {
            const hasBid = bids.some(b => b.supplierId === s.id);
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-md)', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
              }}>
                <div className="avatar" style={{ background: hasBid ? 'var(--success)' : 'var(--bg-elevated)' }}>
                  {s.companyName.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>{s.companyName}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={11} /> {s.rating} • {s.totalOrders} orders
                  </div>
                </div>
                <span className={`badge ${hasBid ? 'badge-success' : 'badge-neutral'}`}>
                  {hasBid ? 'Bid Received' : 'Pending'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bids Comparison */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-lg)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Gavel size={18} /> Bids ({bids.length})
        </div>
        {bids.length === 0 ? (
          <div className="empty-state">
            <Gavel size={48} />
            <h3>No bids yet</h3>
            <p>Waiting for suppliers to submit their bids</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {bids.map(bid => {
              const supplier = suppliers.find(s => s.id === bid.supplierId);
              const isAwarded = tender.awardedBidId === bid.id;
              return (
                <div key={bid.id} style={{
                  padding: 'var(--space-lg)',
                  background: isAwarded ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${isAwarded ? 'var(--success)' : 'var(--border)'}`,
                  position: 'relative',
                  transition: 'all var(--transition-base)',
                }}>
                  {isAwarded && (
                    <div style={{
                      position: 'absolute', top: -1, right: 16,
                      background: 'var(--success)', color: 'white',
                      padding: '4px 12px', borderRadius: '0 0 8px 8px',
                      fontSize: 'var(--font-xs)', fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 4,
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}>
                      <ShieldCheck size={12} /> Winner
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    {/* Supplier Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-md)' }}>{bid.supplierName}</span>
                        <span className={`badge ${getStatusBadgeClass(bid.status)}`}>{getStatusLabel(bid.status)}</span>
                      </div>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Star size={13} color="var(--warning)" /> {supplier?.rating || '—'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Truck size={13} /> {bid.deliveryDays} days delivery
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={13} /> Valid until {formatDate(bid.validUntil)}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 'var(--font-xl)', fontWeight: 800,
                        color: bid.totalAmount <= tender.estimatedBudget ? 'var(--success-light)' : 'var(--danger-light)'
                      }}>
                        {formatCurrency(bid.totalAmount)}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                        {bid.totalAmount <= tender.estimatedBudget ? 'Within budget' : 'Over budget'}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ marginTop: 'var(--space-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '8px 0', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unit Price</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                          <th style={{ textAlign: 'right', padding: '8px 0', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600, borderBottom: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bid.items.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ padding: '8px 0', fontSize: 'var(--font-sm)' }}>{item.name}</td>
                            <td style={{ padding: '8px 0', fontSize: 'var(--font-sm)', textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
                            <td style={{ padding: '8px 0', fontSize: 'var(--font-sm)', textAlign: 'right' }}>{item.quantity}</td>
                            <td style={{ padding: '8px 0', fontSize: 'var(--font-sm)', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Terms */}
                  <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-sm) var(--space-md)', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Terms:</strong> {bid.terms}
                  </div>

                  <div style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                    Submitted: {formatDateTime(bid.submittedAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Award Modal */}
      {showAwardModal && (
        <div className="modal-overlay" onClick={() => setShowAwardModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <h3 className="modal-title"><Award size={20} style={{ marginRight: 8 }} /> Award Tender</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
              Select the winning bid for <strong>{tender.title}</strong>
            </p>
            <div className="form-group">
              <label className="form-label">Select Winning Bid *</label>
              <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                {bids.filter(b => b.status !== 'withdrawn').map(bid => (
                  <label key={bid.id} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                    padding: 'var(--space-md)', background: selectedBidId === bid.id ? 'var(--primary-glow)' : 'var(--bg-surface)',
                    borderRadius: 'var(--radius-md)', cursor: 'pointer',
                    border: `1px solid ${selectedBidId === bid.id ? 'var(--primary)' : 'var(--border)'}`,
                    transition: 'all var(--transition-fast)'
                  }}>
                    <input type="radio" name="bid" value={bid.id} checked={selectedBidId === bid.id} onChange={e => setSelectedBidId(e.target.value)} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{bid.supplierName}</div>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                        {formatCurrency(bid.totalAmount)} • {bid.deliveryDays} days delivery
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Comments (optional)</label>
              <textarea className="form-textarea" placeholder="Award justification..." value={awardComments} onChange={e => setAwardComments(e.target.value)} />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAwardModal(false)}>Cancel</button>
              <button className="btn btn-success" onClick={handleAward} disabled={!selectedBidId}>
                <Award size={16} /> Confirm Award
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderDetail;
