import { useState } from 'react';
import { purchaseOrders, formatCurrency, getStatusBadgeClass, getStatusLabel, formatDate } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const PurchaseOrderList = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('');
  const filtered = statusFilter ? purchaseOrders.filter(po => po.status === statusFilter) : purchaseOrders;

  return (
    <div className="page">
      <div className="page-header"><h1>Purchase Orders</h1><p>Track and manage all purchase orders</p></div>
      <div className="filter-bar">
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option><option value="sent">Sent</option><option value="accepted">Accepted</option><option value="delivered">Delivered</option><option value="closed">Closed</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>PO Number</th><th>Supplier</th><th>Items</th><th>Total</th><th>Delivery</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(po => (
              <tr key={po.id} onClick={() => navigate(`/purchase-orders/${po.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{po.id}</td>
                <td>{po.supplierName}</td>
                <td>{po.items.length} item(s)</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(po.totalAmount)}</td>
                <td style={{ color: 'var(--text-muted)' }}>{formatDate(po.deliveryDate)}</td>
                <td><span className={`badge ${getStatusBadgeClass(po.status)}`}>{getStatusLabel(po.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
