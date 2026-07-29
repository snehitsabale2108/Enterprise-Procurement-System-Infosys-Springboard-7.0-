import { useState } from 'react';
import { suppliers, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Star } from 'lucide-react';

const SupplierList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = suppliers.filter(s => {
    if (search && !s.companyName.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Supplier Management</h1><p>Manage vendors and supplier lifecycle</p></div>
        <button className="btn btn-primary"><Plus size={18} /> Add Supplier</button>
      </div>
      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
      </div>
      <div className="table-container">
        <table>
          <thead><tr><th>Company</th><th>Type</th><th>Contact</th><th>Rating</th><th>Orders</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} onClick={() => navigate(`/suppliers/${s.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ fontWeight: 600 }}>{s.companyName}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{s.businessType}</td>
                <td>{s.contactPerson}</td>
                <td><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Star size={14} color="#f59e0b" fill="#f59e0b" />{s.rating}</div></td>
                <td>{s.totalOrders}</td>
                <td><span className={`badge ${getStatusBadgeClass(s.status)}`}>{getStatusLabel(s.status)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierList;
