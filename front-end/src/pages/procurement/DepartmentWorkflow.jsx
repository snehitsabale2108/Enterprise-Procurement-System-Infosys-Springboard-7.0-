import { Link } from 'react-router-dom';
import { Boxes } from 'lucide-react';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  useEpsStore,
  getProcurementQueue,
  canProcessCategory,
  poCategory,
  STAGE_LABELS,
  TEAM_LABELS,
  teamForCategory,
} from '../../store/epsStore';
import { purchaseOrders } from '../../data/mockData';
import PoProcessPanel from '../../components/PoProcessPanel';

/**
 * Shared workspace for a department procurement team (equipment, software/IT,
 * facilities). The team sources vendors for its own category and processes the
 * purchase orders raised from it. Central procurement sees everything.
 */
const DepartmentWorkflow = ({ category, title, description }) => {
  const { currentUser } = useAuth();
  useEpsStore();

  const allowed = canProcessCategory(currentUser?.role, category);
  const sourcing = getProcurementQueue().filter((row) => row.request.category === category);
  const orders = purchaseOrders.filter((po) => poCategory(po) === category);

  return (
    <div className="page">
      <div className="page-header">
        <h1>{title}</h1>
        <p>
          {description} • Designated team: {TEAM_LABELS[teamForCategory(category)]}
        </p>
      </div>

      {!allowed && (
        <div className="card" style={{ borderLeft: '3px solid var(--warning)', marginBottom: 'var(--space-lg)' }}>
          <p style={{ fontSize: 'var(--font-sm)' }}>
            You can view this queue, but only {TEAM_LABELS[teamForCategory(category)]} or central
            procurement can select vendors and process these purchase orders.
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>
          Vendor Sourcing Queue ({sourcing.length})
        </div>
        {sourcing.length === 0 ? (
          <div className="empty-state"><Boxes size={40} /><h3>Nothing to source</h3><p>No approved requests in this category.</p></div>
        ) : (
          <div className="table-container" style={{ border: 'none' }}>
            <table>
              <thead><tr><th>Request</th><th>Item</th><th>Budget</th><th>Quotations</th><th>Stage</th><th /></tr></thead>
              <tbody>
                {sourcing.map(({ request, quotations, stage }) => (
                  <tr key={request.id}>
                    <td style={{ fontWeight: 600 }}>{request.id}</td>
                    <td>{request.title}</td>
                    <td>{formatCurrency(request.estimatedCost)}</td>
                    <td>{quotations.length}</td>
                    <td><span className="badge badge-info">{STAGE_LABELS[stage] || stage}</span></td>
                    <td>
                      {allowed ? (
                        <Link className="btn btn-primary btn-sm" to={`/procurement/vendor-selection/${request.id}`}>
                          Select Vendor
                        </Link>
                      ) : (
                        <span className="badge badge-warning">Other team</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>
        Purchase Orders ({orders.length})
      </div>
      {orders.length === 0 ? (
        <div className="card"><p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>No purchase orders in this category yet.</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          {orders.map((po) => (
            <div key={po.id} style={{ display: 'grid', gap: 'var(--space-sm)' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <strong>{po.id}</strong>{' '}
                  <span className={`badge ${getStatusBadgeClass(po.status)}`}>{getStatusLabel(po.status)}</span>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                    {po.supplierName} • {po.requestId} • {formatCurrency(po.totalAmount)}
                  </div>
                </div>
                <Link className="btn btn-secondary btn-sm" to={`/purchase-orders/${po.id}`}>Open PO</Link>
              </div>
              <PoProcessPanel po={po} user={currentUser} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentWorkflow;
