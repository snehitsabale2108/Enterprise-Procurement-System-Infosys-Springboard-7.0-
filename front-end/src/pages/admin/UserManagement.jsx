import { useState } from 'react';
import { departments, roles, formatDate } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import {
  useEpsStore, getUsers, saveUser, assignRole, setUserStatus, getAuditTrail,
} from '../../store/epsStore';
import { Plus, Search, Edit2, X, UserCheck, UserX, ShieldCheck } from 'lucide-react';
import AuditTrail from '../../components/AuditTrail';

const emptyForm = { name: '', email: '', phone: '', role: 'employee', department: '', status: 'active' };

const roleLabel = (name) => roles.find((r) => r.name === name)?.displayName || String(name).replace(/_/g, ' ');

const UserManagement = () => {
  const { currentUser } = useAuth();
  useEpsStore();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [assigning, setAssigning] = useState(null); // { user, role }
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const userList = getUsers();
  const filtered = userList.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter && u.role !== roleFilter) return false;
    if (deptFilter && u.department !== deptFilter) return false;
    return true;
  });

  const openCreate = () => { setEditingUser(null); setForm({ ...emptyForm }); setError(''); setShowModal(true); };
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role, department: user.department, status: user.status });
    setError('');
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) { setError('Name and email are required'); return; }
    try {
      saveUser(form, currentUser, editingUser?.id || null);
      setShowModal(false);
      setInfo(editingUser ? `${form.name} updated — role: ${roleLabel(form.role)}` : `${form.name} created as ${roleLabel(form.role)}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const confirmAssign = () => {
    try {
      assignRole(assigning.user.id, assigning.role, currentUser);
      setInfo(`${assigning.user.name} is now a ${roleLabel(assigning.role)}. Their dashboard now follows this role.`);
      setAssigning(null);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = (user) => {
    setUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active', currentUser);
  };

  const uniqueDepts = [...new Set(userList.map(u => u.department))].sort();

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>User Management</h1><p>Create users, assign roles and manage access. Assigning a role instantly switches that user's dashboard and permissions.</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add User</button>
      </div>

      {info && <div className="alert alert-success" style={{ marginBottom: 'var(--space-md)', color: 'var(--success)' }}>{info}</div>}
      {error && !showModal && !assigning && <div className="alert" style={{ marginBottom: 'var(--space-md)', color: 'var(--danger)' }}>{error}</div>}

      <div className="filter-bar">
        <div className="search-box" style={{ flex: 1, maxWidth: 360 }}>
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {roles.map(r => <option key={r.id} value={r.name}>{r.displayName}</option>)}
        </select>
        <select className="form-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>User</th><th>Email</th><th>Assigned Role</th><th>Department</th><th>Status</th><th>Joined</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>No users found</td></tr>
            ) : filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <div className="avatar avatar-sm" style={{ background: u.avatar }}>{u.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{u.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                <td>
                  <select
                    className="form-select"
                    data-testid={`role-select-${u.id}`}
                    value={u.role}
                    onChange={(e) => setAssigning({ user: u, role: e.target.value })}
                    style={{ minWidth: 190 }}
                  >
                    {roles.map(r => <option key={r.id} value={r.name}>{r.displayName}</option>)}
                  </select>
                </td>
                <td>{u.department}</td>
                <td><span className={`badge ${u.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>{u.status}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)' }}>{formatDate(u.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-xs)', justifyContent: 'flex-end' }}>
                    <button className="btn btn-ghost btn-sm" title="Edit" onClick={() => openEdit(u)}><Edit2 size={15} /></button>
                    <button className="btn btn-ghost btn-sm" title={u.status === 'active' ? 'Deactivate' : 'Activate'} onClick={() => toggleStatus(u)}>
                      {u.status === 'active' ? <UserX size={15} color="var(--warning)" /> : <UserCheck size={15} color="var(--success)" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {assigning && (
        <div className="modal-overlay" onClick={() => setAssigning(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h2 className="modal-title"><ShieldCheck size={18} /> Assign Role</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setAssigning(null)}><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Change <strong>{assigning.user.name}</strong> from <strong>{roleLabel(assigning.user.role)}</strong> to{' '}
              <strong>{roleLabel(assigning.role)}</strong>? Their dashboard, navigation and permissions will switch to the new role immediately.
            </p>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setAssigning(null)}>Cancel</button>
              <button className="btn btn-primary" data-testid="confirm-assign-role" onClick={confirmAssign}>Assign Role</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter email address" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label className="form-label">Role *</label>
                <select className="form-select" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  {roles.map(r => <option key={r.id} value={r.name}>{r.displayName}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-select" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            {error && <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingUser ? 'Save Changes' : 'Create User'}</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 'var(--space-xl)' }}>
        <AuditTrail entries={getAuditTrail().filter(a => a.entity === 'User').slice(0, 15)} title="Recent Role & User Changes" />
      </div>
    </div>
  );
};

export default UserManagement;
