import { useState } from 'react';
import { categories as initialCats } from '../../data/mockData';
import { Plus, Edit2, Trash2, X, Tag, Monitor, Code, Building } from 'lucide-react';

const iconMap = { Monitor, Code, Building };
const teamLabels = { equipment_team: 'Equipment Team', software_team: 'Software Team', facilities_team: 'Facilities Team' };
const categoryColors = ['#6366f1', '#06b6d4', '#10b981'];

const emptyCatForm = { name: '', subcategories: '', routeTo: 'equipment_team', icon: 'Monitor' };

const CategoryManagement = () => {
  const [catList, setCatList] = useState([...initialCats]);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [form, setForm] = useState({ ...emptyCatForm });

  const openCreate = () => { setEditingCat(null); setForm({ ...emptyCatForm }); setShowModal(true); };
  const openEdit = (cat) => {
    setEditingCat(cat);
    setForm({ name: cat.name, subcategories: cat.subcategories.join(', '), routeTo: cat.routeTo, icon: cat.icon });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    const parsed = { ...form, subcategories: form.subcategories.split(',').map(s => s.trim()).filter(Boolean) };
    if (editingCat) {
      setCatList(prev => prev.map(c => c.id === editingCat.id ? { ...c, ...parsed } : c));
    } else {
      const newCat = { id: `C${String(catList.length + 1).padStart(3, '0')}`, ...parsed };
      setCatList(prev => [...prev, newCat]);
    }
    setShowModal(false);
  };

  const deleteCat = (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    setCatList(prev => prev.filter(c => c.id !== cat.id));
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Category Management</h1><p>Manage procurement categories and subcategories</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Category</button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
        {catList.map((cat, i) => {
          const color = categoryColors[i % categoryColors.length];
          const IconComp = iconMap[cat.icon] || Tag;
          return (
            <div key={cat.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComp size={24} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700 }}>{cat.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginTop: 4 }}>
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Routes to:</span>
                      <span className="badge badge-info" style={{ textTransform: 'none', letterSpacing: 0 }}>{teamLabels[cat.routeTo] || cat.routeTo}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => openEdit(cat)}><Edit2 size={15} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => deleteCat(cat)}><Trash2 size={15} color="var(--danger)" /></button>
                </div>
              </div>

              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
                Subcategories ({cat.subcategories.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cat.subcategories.map(sub => (
                  <span key={sub} style={{
                    padding: '6px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)',
                    fontWeight: 500, transition: 'all 0.15s ease'
                  }}>
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingCat ? 'Edit Category' : 'Add Category'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Office Supplies" />
            </div>
            <div className="form-group">
              <label className="form-label">Subcategories (comma-separated)</label>
              <textarea className="form-textarea" value={form.subcategories} onChange={e => setForm({ ...form, subcategories: e.target.value })} placeholder="e.g. Pens, Paper, Stapler, Notebooks" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Route To Team</label>
                <select className="form-select" value={form.routeTo} onChange={e => setForm({ ...form, routeTo: e.target.value })}>
                  <option value="equipment_team">Equipment Team</option>
                  <option value="software_team">Software Team</option>
                  <option value="facilities_team">Facilities Team</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <select className="form-select" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                  <option value="Monitor">Monitor (Equipment)</option>
                  <option value="Code">Code (Software)</option>
                  <option value="Building">Building (Facilities)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingCat ? 'Save Changes' : 'Create Category'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
