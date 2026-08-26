import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { useEpsStore, getProcurementQueue, STAGE_LABELS } from '../../store/epsStore';
import { Package, ArrowRight, Award, FileText } from 'lucide-react';

const STAGE_BADGE = {
  rfq_pending: 'badge-warning',
  awaiting_quotations: 'badge-info',
  finance_review: 'badge-warning',
  vendor_selection: 'badge-primary',
  po_created: 'badge-success',
};

const ProcurementQueue = () => {
  const navigate = useNavigate();
  useEpsStore();

  const queue = getProcurementQueue();

  return (
    <div className="page">
      <div className="page-header">
        <h1>Procurement Queue</h1>
        <p>Approved requests ready for sourcing, quotation review and vendor award</p>
      </div>

      {queue.length === 0 ? (
        <div className="card"><div className="empty-state"><Package size={48} /><h3>No pending requests</h3><p>All approved requests have been processed</p></div></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
          {queue.map(({ request: r, rfqs: reqRfqs, quotations: reqQuotes, stage }) => {
            const approvedCount = reqQuotes.filter((q) => q.financeStatus === 'approved').length;
            return (
              <div key={r.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</span>
                    <span className="badge badge-info">{r.category.split(' ')[0]}</span>
                    <span className={`badge ${STAGE_BADGE[stage] || 'badge-neutral'}`}>{STAGE_LABELS[stage]}</span>
                    <span className={`badge ${getStatusBadgeClass(r.status)}`}>{getStatusLabel(r.status)}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600 }}>{r.title}</h3>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 4 }}>
                    {r.department} • Qty: {r.quantity} • {formatCurrency(r.estimatedCost)} • needed by {formatDate(r.requiredDate)}
                  </p>
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
                    <FileText size={13} /> {reqRfqs.length} RFQ(s) • {reqQuotes.length} quotation(s) • {approvedCount} finance-approved
                    {r.selectedSupplierName ? ` • awarded to ${r.selectedSupplierName}` : ''}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/requests/${r.id}`)}>
                    Details
                  </button>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/procurement/vendor-selection/${r.id}`)}>
                    {stage === 'vendor_selection' ? <><Award size={14} /> Select Vendor</> : <>Process <ArrowRight size={14} /></>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProcurementQueue;
