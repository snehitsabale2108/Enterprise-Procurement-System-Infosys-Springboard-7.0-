import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tenders, tenderBids, suppliers, formatCurrency, formatDate } from '../../data/mockData';
import { ArrowLeft, Plus, Trash2, Send, XCircle } from 'lucide-react';

const SupplierBidForm = () => {
  const { id: tenderId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const tender = tenders.find(t => t.id === tenderId);
  const supplierId = currentUser?.supplierId;
  const supplierInfo = suppliers.find(s => s.id === supplierId);
  const existingBid = tenderBids.find(b => b.tenderId === tenderId && b.supplierId === supplierId);

  const [items, setItems] = useState(
    existingBid?.items || [{ name: '', unitPrice: '', quantity: tender?.quantity || 1, total: 0 }]
  );
  const [deliveryDays, setDeliveryDays] = useState(existingBid?.deliveryDays || '');
  const [validUntil, setValidUntil] = useState(existingBid?.validUntil || '');
  const [terms, setTerms] = useState(existingBid?.terms || '');

  if (!tender) return <div className="page"><div className="empty-state"><h3>Tender not found</h3></div></div>;
  if (tender.status !== 'open' && !existingBid) return <div className="page"><div className="empty-state"><h3>This tender is no longer accepting bids</h3></div></div>;

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'unitPrice' || field === 'quantity') {
      const price = parseFloat(updated[index].unitPrice) || 0;
      const qty = parseInt(updated[index].quantity) || 0;
      updated[index].total = price * qty;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { name: '', unitPrice: '', quantity: 1, total: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.some(item => !item.name || !item.unitPrice)) {
      alert('Please fill in all item details');
      return;
    }
    if (!deliveryDays || !validUntil) {
      alert('Please fill delivery days and validity date');
      return;
    }

    const bidData = {
      supplierId,
      supplierName: supplierInfo?.companyName || currentUser?.name,
      items: items.map(item => ({
        name: item.name,
        unitPrice: parseFloat(item.unitPrice),
        quantity: parseInt(item.quantity),
        total: item.total,
      })),
      totalAmount,
      deliveryDays: parseInt(deliveryDays),
      validUntil,
      terms,
    };

    if (existingBid) {
      // Update existing bid
      Object.assign(existingBid, bidData, { updatedAt: new Date().toISOString() });
      alert('Bid updated successfully!');
    } else {
      // Submit new bid
      const newBid = {
        ...bidData,
        id: `BID-${String(tenderBids.length + 1).padStart(3, '0')}`,
        tenderId,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tenderBids.push(newBid);
      alert('Bid submitted successfully!');
    }

    navigate('/supplier/tenders');
  };

  const handleWithdraw = () => {
    if (existingBid && confirm('Are you sure you want to withdraw this bid?')) {
      existingBid.status = 'withdrawn';
      alert('Bid withdrawn');
      navigate('/supplier/tenders');
    }
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>

      <div style={{ marginTop: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>
          {existingBid ? 'Edit Bid' : 'Submit Bid'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
          {tender.title}
        </p>
      </div>

      {/* Tender Info */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Tender Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Tender ID</div>
            <div style={{ fontWeight: 600 }}>{tender.id}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Category</div>
            <div style={{ fontWeight: 600 }}>{tender.category}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Budget</div>
            <div style={{ fontWeight: 600 }}>{formatCurrency(tender.estimatedBudget)}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Deadline</div>
            <div style={{ fontWeight: 600 }}>{formatDate(tender.deadline)}</div>
          </div>
        </div>
        {tender.specifications && (
          <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>Specifications</div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tender.specifications}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Bid Items */}
        <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <div className="card-title">Bid Items</div>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 80px 1fr 40px',
              gap: 'var(--space-sm)', alignItems: 'end',
              marginBottom: 'var(--space-md)',
              padding: 'var(--space-md)', background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)', border: '1px solid var(--border)'
            }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Item Name</label>
                <input className="form-input" type="text" placeholder="e.g., MacBook Pro 16 inch" value={item.name} onChange={e => updateItem(index, 'name', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Unit Price (₹)</label>
                <input className="form-input" type="number" placeholder="0" value={item.unitPrice} onChange={e => updateItem(index, 'unitPrice', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Qty</label>
                <input className="form-input" type="number" min="1" value={item.quantity} onChange={e => updateItem(index, 'quantity', e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: 'var(--font-xs)' }}>Total</label>
                <input className="form-input" type="text" value={formatCurrency(item.total || 0)} disabled style={{ opacity: 0.7, fontWeight: 600 }} />
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeItem(index)} disabled={items.length === 1} style={{ marginBottom: 0 }}>
                <Trash2 size={16} color="var(--danger)" />
              </button>
            </div>
          ))}

          {/* Total */}
          <div style={{
            display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-lg)',
            padding: 'var(--space-md)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Grand Total:</span>
            <span style={{
              fontSize: 'var(--font-xl)', fontWeight: 800,
              color: totalAmount <= tender.estimatedBudget ? 'var(--success-light)' : 'var(--danger-light)'
            }}>
              {formatCurrency(totalAmount)}
            </span>
          </div>
          {totalAmount > tender.estimatedBudget && (
            <div style={{ marginTop: 'var(--space-sm)', fontSize: 'var(--font-sm)', color: 'var(--danger-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
              ⚠️ Your bid exceeds the estimated budget by {formatCurrency(totalAmount - tender.estimatedBudget)}
            </div>
          )}
        </div>

        {/* Delivery & Terms */}
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Delivery & Terms</div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Delivery Timeline (Days) *</label>
              <input className="form-input" type="number" min="1" placeholder="e.g., 7" value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Bid Valid Until *</label>
              <input className="form-input" type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Terms & Conditions</label>
            <textarea className="form-textarea" placeholder="Delivery terms, warranty details, payment conditions, etc..." value={terms} onChange={e => setTerms(e.target.value)} style={{ minHeight: 120 }} />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'space-between' }}>
          <div>
            {existingBid && existingBid.status !== 'withdrawn' && (
              <button type="button" className="btn btn-danger" onClick={handleWithdraw}>
                <XCircle size={16} /> Withdraw Bid
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg">
              <Send size={18} /> {existingBid ? 'Update Bid' : 'Submit Bid'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SupplierBidForm;
