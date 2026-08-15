import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  suppliers, formatCurrency, formatDateTime, getStatusBadgeClass, getStatusLabel,
} from '../../data/mockData';
import {
  useEpsStore, getRequest, getRequestQuotations, getRequestRfqs, createRfqs, selectVendor,
  canProcessCategory, teamForCategory, TEAM_LABELS, getRequestAuditTrail,
} from '../../store/epsStore';
import AuditTrail from '../../components/AuditTrail';
import {
  ArrowLeft, Award, CheckCircle, Clock, Send, Star, Truck, XCircle,
} from 'lucide-react';

/**
 * Procurement officer workspace for one approved request:
 * send RFQs, compare quotations, and award the vendor.
 * Only finance-approved quotations can be selected.
 */
const VendorSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  useEpsStore();

  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [confirmQuotation, setConfirmQuotation] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const request = getRequest(id);
  if (!request) {
    return <div className="page"><div className="empty-state"><h3>Request not found</h3></div></div>;
  }

  const canProcess = canProcessCategory(currentUser?.role, request.category);
  const rfqList = getRequestRfqs(id);
  const quotationList = getRequestQuotations(id);
  const awarded = quotationList.find((q) => q.selected);
  const invitedSupplierIds = rfqList.map((r) => r.supplierId);
  const availableSuppliers = suppliers.filter(
    (s) => s.status === 'active' && !invitedSupplierIds.includes(s.id),
  );
  const cheapest = Math.min(
    ...quotationList.filter((q) => q.financeStatus === 'approved').map((q) => q.totalAmount),
  );

  const toggleSupplier = (supplierId) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId) ? prev.filter((s) => s !== supplierId) : [...prev, supplierId],
    );
  };

  const sendRfqs = () => {
    try {
      const created = createRfqs(id, selectedSuppliers, { user: currentUser });
      setSelectedSuppliers([]);
      setError('');
      setInfo(`${created.length} RFQ(s) sent. Suppliers have been notified.`);
    } catch (err) {
      setError(err.message);
      setInfo('');
    }
  };

  const award = () => {
    try {
      const { purchaseOrder } = selectVendor(confirmQuotation.id, currentUser);
      setConfirmQuotation(null);
      setError('');
      setInfo(`${confirmQuotation.supplierName} awarded. ${purchaseOrder.id} created.`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <button className="btn btn-ghost" onClick={() => navigate('/procurement')}>
        <ArrowLeft size={18} /> Back to Procurement Queue
      </button>

      <div className="page-header" style={{ marginTop: 'var(--space-md)' }}>
        <h1>Vendor Selection — {request.id}</h1>
        <p>
          {request.title} • Qty {request.quantity} • Budget {formatCurrency(request.estimatedCost)}
          {' '}<span className={`badge ${getStatusBadgeClass(request.status)}`}>{getStatusLabel(request.status)}</span>
        </p>
      </div>

      {info && (
        <div className="card" style={{ borderLeft: '3px solid var(--success)', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: 'var(--font-sm)' }}>{info}</p>
        </div>
      )}
      {error && (
        <div className="card" style={{ borderLeft: '3px solid var(--danger)', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--danger)' }}>{error}</p>
        </div>
      )}

      {awarded && (
        <div className="card" style={{ borderLeft: '3px solid var(--primary)', marginBottom: 'var(--space-lg)' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Award size={16} /> Awarded to {awarded.supplierName}
          </div>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 6 }}>
            {formatCurrency(awarded.totalAmount)} • Purchase order {request.poId}
          </p>
          {request.poId && (
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={() => navigate(`/purchase-orders/${request.poId}`)}>
              View Purchase Order
            </button>
          )}
        </div>
      )}

      {!canProcess && (
        <div className="card" data-testid="dept-gate" style={{ borderLeft: '3px solid var(--warning)', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: 'var(--font-sm)' }}>
            {request.category} is handled by {TEAM_LABELS[teamForCategory(request.category)]}. You can
            review the quotations but not award this request.
          </p>
        </div>
      )}

      {/* Invite suppliers */}
      {!awarded && canProcess && (
        <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Invite Suppliers (RFQ)</div>
          {availableSuppliers.length === 0 ? (
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>All active suppliers have been invited.</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {availableSuppliers.map((s) => (
                  <button
                    key={s.id}
                    className={`btn btn-sm ${selectedSuppliers.includes(s.id) ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => toggleSupplier(s.id)}
                  >
                    {selectedSuppliers.includes(s.id) && <CheckCircle size={13} />} {s.companyName}
                    {s.rating ? <span style={{ marginLeft: 6, opacity: 0.8 }}><Star size={11} /> {s.rating}</span> : null}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 'var(--space-md)' }}
                disabled={!selectedSuppliers.length}
                onClick={sendRfqs}
              >
                <Send size={14} /> Send RFQ to {selectedSuppliers.length || 0} supplier(s)
              </button>
            </>
          )}
          {rfqList.length > 0 && (
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
              Already invited: {rfqList.map((r) => `${r.supplierName} (${getStatusLabel(r.status)})`).join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Quotation comparison */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>
          Quotation Comparison ({quotationList.length})
        </div>
        {quotationList.length === 0 ? (
          <div className="empty-state">
            <Clock size={40} />
            <h3>No quotations yet</h3>
            <p>Suppliers have not submitted quotations for this request.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Quotation</th>
                  <th>Supplier</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Delivery</th>
                  <th>Warranty</th>
                  <th>Finance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quotationList.map((q) => {
                  const eligible = q.financeStatus === 'approved' && !awarded && canProcess;
                  return (
                    <tr key={q.id} style={q.selected ? { background: 'var(--bg-surface)' } : undefined}>
                      <td>
                        {q.id}
                        {q.financeStatus === 'approved' && q.totalAmount === cheapest && (
                          <span className="badge badge-success" style={{ marginLeft: 6 }}>Lowest</span>
                        )}
                      </td>
                      <td>{q.supplierName}</td>
                      <td>{formatCurrency(q.unitPrice)}</td>
                      <td><strong>{formatCurrency(q.totalAmount)}</strong></td>
                      <td><Truck size={13} /> {q.estimatedDeliveryTime || '—'}</td>
                      <td>{q.warranty || '—'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(q.financeStatus)}`}>{getStatusLabel(q.financeStatus)}</span>
                        {q.financeComments && (
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{q.financeComments}</div>
                        )}
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{formatDateTime(q.submittedAt)}</div>
                      </td>
                      <td>
                        {q.selected ? (
                          <span className="badge badge-primary"><Award size={12} /> Selected</span>
                        ) : q.financeStatus === 'rejected' ? (
                          <span className="badge badge-danger"><XCircle size={12} /> Rejected</span>
                        ) : eligible ? (
                          <button className="btn btn-primary btn-sm" onClick={() => setConfirmQuotation(q)}>
                            <Award size={13} /> Select
                          </button>
                        ) : (
                          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                            {awarded ? 'Not selected' : 'Awaiting finance approval'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <AuditTrail entries={getRequestAuditTrail(id)} title={`Audit Trail — ${request.id}`} />
      </div>

      {confirmQuotation && (
        <div className="modal-overlay" onClick={() => setConfirmQuotation(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Award to {confirmQuotation.supplierName}?</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              A purchase order of {formatCurrency(confirmQuotation.totalAmount)} will be raised and the
              supplier notified. All other quotations for {request.id} will be marked as not selected.
            </p>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmQuotation(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={award}><Award size={14} /> Confirm Award</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorSelection;