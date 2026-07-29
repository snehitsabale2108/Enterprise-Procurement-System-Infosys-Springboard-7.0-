import { payments, formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';

const PaymentProcessing = () => (
  <div className="page">
    <div className="page-header"><h1>Payment Processing</h1><p>Track and process supplier payments</p></div>
    <div className="table-container">
      <table>
        <thead><tr><th>Payment ID</th><th>PO Number</th><th>Supplier</th><th>Amount</th><th>Method</th><th>Reference</th><th>Status</th><th>Paid Date</th></tr></thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id}>
              <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{p.id}</td>
              <td>{p.poNumber}</td>
              <td>{p.supplierName}</td>
              <td style={{ fontWeight: 600 }}>{formatCurrency(p.amount)}</td>
              <td>{p.paymentMethod || '—'}</td>
              <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-xs)' }}>{p.referenceNumber || '—'}</td>
              <td><span className={`badge ${getStatusBadgeClass(p.status)}`}>{getStatusLabel(p.status)}</span></td>
              <td style={{ color: 'var(--text-muted)' }}>{formatDate(p.paidDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PaymentProcessing;
