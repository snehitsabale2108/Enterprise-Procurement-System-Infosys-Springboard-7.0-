import { useState } from 'react';
import { approvalRules as initialRules, formatCurrency } from '../../data/mockData';
import { Plus, Edit2, Trash2, X, GitBranch, ArrowRight, CheckCircle } from 'lucide-react';

const levelLabels = { manager: 'Manager', senior_manager: 'Senior Manager', head: 'Head' };
const levelColors = { manager: '#06b6d4', senior_manager: '#f59e0b', head: '#ef4444' };

const ApprovalRulesPage = () => {
  const [rules, setRules] = useState([...initialRules]);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState({ minAmount: '', maxAmount: '', description: '', levels: ['manager'] });

  const openCreate = () => { setEditingRule(null); setForm({ minAmount: '', maxAmount: '', description: '', levels: ['manager'] }); setShowModal(true); };
  const openEdit = (rule) => {
    setEditingRule(rule);
    setForm({ minAmount: rule.minAmount, maxAmount: rule.maxAmount === Infinity ? '' : rule.maxAmount, description: rule.description, levels: [...rule.levels] });
    setShowModal(true);
  };

  const toggleLevel = (level) => {
    setForm(prev => {
      const has = prev.levels.includes(level);
      let newLevels;
      if (has) {
        newLevels = prev.levels.filter(l => l !== level);
      } else {
        newLevels = [...prev.levels, level];
      }
      // Maintain order: manager -> senior_manager -> head
      const order = ['manager', 'senior_manager', 'head'];
      newLevels.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      return { ...prev, levels: newLevels };
    });
  };

  const handleSave = () => {
    if (form.levels.length === 0) return;
    const parsed = {
      minAmount: Number(form.minAmount) || 0,
      maxAmount: form.maxAmount === '' || form.maxAmount === undefined ? Infinity : Number(form.maxAmount),
      description: form.description,
      levels: form.levels,
    };
    if (editingRule) {
      setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...parsed } : r));
    } else {
      const newRule = { id: `AR${String(rules.length + 1).padStart(3, '0')}`, ...parsed };
      setRules(prev => [...prev, newRule]);
    }
    setShowModal(false);
  };

  const deleteRule = (rule) => {
    if (!confirm('Delete this approval rule?')) return;
    setRules(prev => prev.filter(r => r.id !== rule.id));
  };

  return (
    <div className="page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div><h1>Approval Rules</h1><p>Configure threshold-based approval routing</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={18} /> Add Rule</button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
        {rules.map((rule, i) => (
          <div key={rule.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GitBranch size={22} color="var(--primary)" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: 4 }}>{rule.description}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                      {formatCurrency(rule.minAmount)}
                    </span>
                    <ArrowRight size={14} color="var(--text-muted)" />
                    <span style={{ fontFamily: 'monospace', fontSize: 'var(--font-sm)', background: 'var(--bg-elevated)', padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                      {rule.maxAmount === Infinity ? '∞ (No Limit)' : formatCurrency(rule.maxAmount)}
                    </span>
                  </div>

                  {/* Visual approval chain */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>CHAIN:</span>
                    {rule.levels.map((level, j) => (
                      <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
                          background: `${levelColors[level]}18`, border: `1px solid ${levelColors[level]}40`,
                          borderRadius: 'var(--radius-full)', fontSize: 'var(--font-sm)', fontWeight: 600, color: levelColors[level]
                        }}>
                          <CheckCircle size={13} /> {levelLabels[level]}
                        </div>
                        {j < rule.levels.length - 1 && <ArrowRight size={14} color="var(--text-muted)" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', flexShrink: 0 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(rule)}><Edit2 size={15} /></button>
                <button className="btn btn-ghost btn-sm" onClick={() => deleteRule(rule)}><Trash2 size={15} color="var(--danger)" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingRule ? 'Edit Rule' : 'Add Approval Rule'}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. Medium value procurement" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Min Amount (₹)</label>
                <input className="form-input" type="number" value={form.minAmount} onChange={e => setForm({ ...form, minAmount: e.target.value })} placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Max Amount (₹) — leave empty for ∞</label>
                <input className="form-input" type="number" value={form.maxAmount} onChange={e => setForm({ ...form, maxAmount: e.target.value })} placeholder="No limit" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Approval Levels *</label>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                {['manager', 'senior_manager', 'head'].map(level => (
                  <button key={level} type="button" onClick={() => toggleLevel(level)} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 'var(--font-sm)',
                    border: form.levels.includes(level) ? `2px solid ${levelColors[level]}` : '2px solid var(--border)',
                    background: form.levels.includes(level) ? `${levelColors[level]}18` : 'var(--bg-surface)',
                    color: form.levels.includes(level) ? levelColors[level] : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}>
                    {form.levels.includes(level) && <CheckCircle size={13} style={{ marginRight: 6, verticalAlign: -2 }} />}
                    {levelLabels[level]}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingRule ? 'Save Changes' : 'Create Rule'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalRulesPage;
