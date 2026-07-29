import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { requests, formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { Plus, Search, Filter } from 'lucide-react';

const RequestList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const isEmployee = currentUser?.role === 'employee';
  const allRequests = isEmployee ? requests.filter(r => r.createdBy === currentUser?.id) : requests;

  const filtered = allRequests.filter(r => {
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.id.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Procurement Requests</h1>
          <p>{isEmployee ? 'Your procurement requests' : 'All procurement requests'}</p>
        </div>
        {(isEmployee || currentUser?.role === 'admin') && (
          <button className="btn btn-primary" onClick={() => navigate('/requests/create')}>
            <Plus size={18} /> New Request
          </button>
        )}
      </div>

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search by title or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_manager">Pending Manager</option>
          <option value="pending_senior_manager">Pending Sr. Manager</option>
          <option value="pending_head">Pending Head</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="in_procurement">In Procurement</option>
          <option value="delivered">Delivered</option>
          <option value="closed">Closed</option>
        </select>
        <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Equipment & Assets">Equipment & Assets</option>
          <option value="Software & Digital Services">Software & Digital</option>
          <option value="Facilities">Facilities</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No requests found</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} onClick={() => navigate(`/requests/${r.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{r.id}</td>
                <td>{r.title}</td>
                <td><span className="badge badge-info">{r.category.split(' ')[0]}</span></td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(r.estimatedCost)}</td>
                <td><span className={`badge ${r.priority === 'high' ? 'badge-danger' : r.priority === 'medium' ? 'badge-warning' : 'badge-neutral'}`}>{r.priority}</span></td>
                <td><span className={`badge ${getStatusBadgeClass(r.status)}`}>{getStatusLabel(r.status)}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestList;
