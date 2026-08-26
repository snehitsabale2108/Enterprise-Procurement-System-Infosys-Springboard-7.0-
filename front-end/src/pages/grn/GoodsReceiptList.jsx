import { goodsReceiptNotes, formatDate } from '../../data/mockData';
import { Package, CheckCircle, XCircle } from 'lucide-react';

const GoodsReceiptList = () => (
  <div className="page">
    <div className="page-header"><h1>Goods Receipt Notes</h1><p>Track deliveries and quality verification</p></div>
    {goodsReceiptNotes.length === 0 ? (
      <div className="card"><div className="empty-state"><Package size={48} /><h3>No GRN records</h3></div></div>
    ) : (
      <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
        {goodsReceiptNotes.map(grn => (
          <div key={grn.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{grn.id}</span>
                  <span className={`badge ${grn.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{grn.status}</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginTop: 4 }}>PO: {grn.poNumber} • Received: {formatDate(grn.receivedDate)}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {grn.handoverConfirmed ? <><CheckCircle size={14} color="var(--success)" /><span style={{ fontSize: 'var(--font-sm)', color: 'var(--success)' }}>Handover Confirmed</span></> : <span className="badge badge-warning">Pending Handover</span>}
              </div>
            </div>
            <div className="table-container" style={{ border: 'none' }}>
              <table>
                <thead><tr><th>Item</th><th>Ordered</th><th>Received</th><th>Quality</th></tr></thead>
                <tbody>
                  {grn.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td><td>{item.orderedQty}</td><td>{item.receivedQty}</td>
                      <td><span className={`badge ${item.qualityCheck === 'passed' ? 'badge-success' : 'badge-danger'}`}>{item.qualityCheck}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {grn.remarks && <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Remarks: {grn.remarks}</p>}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default GoodsReceiptList;
