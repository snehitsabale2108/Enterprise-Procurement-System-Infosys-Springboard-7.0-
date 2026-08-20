import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { useEpsStore, getPurchaseOrder, getAuditTrail } from '../../store/epsStore';
import PoProcessPanel from '../../components/PoProcessPanel';
import AuditTrail from '../../components/AuditTrail';

const PurchaseOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEpsStore();

  const po = getPurchaseOrder(id);
  if (!po) return <div className="page"><div className="empty-state"><h3>PO not found</h3></div></div>;

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
      <div style={{ margin: 'var(--space-lg) 0 var(--space-xl)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Purchase Order {po.id}</h1>
          <span className={`badge ${getStatusBadgeClass(po.status)}`} style={{ marginTop: 8, display: 'inline-flex' }}>{getStatusLabel(po.status)}</span>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
          <div>Created: {formatDate(po.createdAt)}</div>
          <div>Delivery: {formatDate(po.deliveryDate)}</div>
        </div>
      </div>
      <div className="grid grid-2 gap-lg" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Supplier</div>
          <p style={{ fontSize: 'var(--font-md)', fontWeight: 600 }}>{po.supplierName}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)', marginTop: 4 }}>Request: {po.requestId}</p>
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Financial Summary</div>
          <div style={{ display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Subtotal</span><span>{formatCurrency(po.subtotal)}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Tax (GST 18%)</span><span>{formatCurrency(po.tax)}</span></div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'var(--font-lg)' }}><span>Total</span><span style={{ color: 'var(--primary-light)' }}>{formatCurrency(po.totalAmount)}</span></div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <PoProcessPanel po={po} user={currentUser} />
      </div>

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Line Items</div>
        <div className="table-container" style={{ border: 'none' }}>
          <table>
            <thead><tr><th>Item</th><th>Quantity</th><th>Unit Price</th><th>Total</th></tr></thead>
            <tbody>
              {po.items.map((item, i) => (
                <tr key={i}><td style={{ fontWeight: 600 }}>{item.name}</td><td>{item.quantity}</td><td>{formatCurrency(item.unitPrice)}</td><td style={{ fontWeight: 600 }}>{formatCurrency(item.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AuditTrail entries={getAuditTrail(po.id)} title={`Audit Trail — ${po.id}`} />
    </div>
  );
};

export default PurchaseOrderDetail;
