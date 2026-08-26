import { useState } from 'react';
import { departments as initialDepts, formatCurrency } from '../../data/mockData';
import { Plus, Edit2, Trash2, X, Building2 } from 'lucide-react';

const emptyForm = { name: '', head: '', budget: '', employeeCount: '', status: 'active' };

const DepartmentManagement = () => {
  const [deptList, setDeptList] = useState([...initialDepts]);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });

  const openCreate = () => { setEditingDept(null); setForm({ ...emptyForm }); setShowModal(true); };
  const openEdit = (dept) => {
    setEditingDept(dept);
    setForm({ name: dept.name, head: dept.head, budget: dept.budget, employeeCount: dept.employeeCount, status: dept.status });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editingDept) {
      setDeptList(prev => prev.map(d => d.id === editingDept.id ? { ...d, ...form, budget: Number(form.budget), employeeCount: Number(form.employeeCount) } : d));
    } else {
      const newDept = {
        id: `D${String(deptList.length + 1).padStart(3, '0')}`,
        name: form.name, head: form.head, budget: Number(form.budget) || 0,
        budgetUsed: 0, employeeCount: Number(form.employeeCount) || 0, status: form.status
      };
      setDeptList(prev => [...prev, newDept]);
    }
    setShowModal(false);
  };

  const deleteDept = (dept) => {
    if (!confirm(`Delete department "${dept.name}"?`)) return;
    setDeptList(prev => prev.filter(d => d.id !== dept.id));
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Department Management</h1><p>Manage departments and their budgets</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Department</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-md)' }}>
        {deptList.map(dept => {
          const utilization = dept.budget > 0 ? (dept.budgetUsed / dept.budget) * 100 : 0;
          const utilColor = utilization > 85 ? 'var(--danger)' : utilization > 60 ? 'var(--warning)' : 'var(--success)';
          return (
            <div key={dept.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{dept.name}</h3>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Head: {dept.head}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(dept)}><Edit2 size={14} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteDept(dept)}><Trash2 size={14} color="var(--danger)" /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Budget</div>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{formatCurrency(dept.budget)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>Employees</div>
                  <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{dept.employeeCount}</div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 6 }}>
                  <span>Budget Utilization</span>
                  <span style={{ color: utilColor, fontWeight: 600 }}>{utilization.toFixed(0)}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(utilization, 100)}%`, background: utilColor, borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Used: {formatCurrency(dept.budgetUsed)}</span>
                  <span>Remaining: {formatCurrency(dept.budget - dept.budgetUsed)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingDept ? 'Edit Department' : 'Add Department'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Research & Development" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Department Head</label>
                <input className="form-input" value={form.head} onChange={e => setForm({ ...form, head: e.target.value })} placeholder="Head of Department" />
              </div>
              <div className="form-group">
                <label className="form-label">Employee Count</label>
                <input className="form-input" type="number" value={form.employeeCount} onChange={e => setForm({ ...form, employeeCount: e.target.value })} placeholder="0" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Annual Budget (₹)</label>
                <input className="form-input" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingDept ? 'Save Changes' : 'Create Department'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;
