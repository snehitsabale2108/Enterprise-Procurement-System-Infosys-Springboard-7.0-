import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { categories } from '../../data/mockData';
import { Save, Send, ArrowLeft } from 'lucide-react';

const CreateRequest = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', reason: '', category: '', subcategory: '', quantity: 1, estimatedCost: '', requiredDate: '', priority: 'medium' });
  const [subcategories, setSubcategories] = useState([]);

  const handleCategoryChange = (e) => {
    const cat = categories.find(c => c.name === e.target.value);
    setForm({ ...form, category: e.target.value, subcategory: '' });
    setSubcategories(cat ? cat.subcategories : []);
  };

  const handleSubmit = (status) => {
    alert(`Request ${status === 'draft' ? 'saved as draft' : 'submitted'} successfully!`);
    navigate('/requests');
  };

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/requests')}><ArrowLeft size={18} /> Back to Requests</button>
        <h1 style={{ marginTop: 'var(--space-md)' }}>Create Procurement Request</h1>
        <p>Fill in the details for your procurement request</p>
      </div>

      <div className="card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="e.g. MacBook Pro 16 inch" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" placeholder="Describe what you need and why..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Justification / Reason *</label>
          <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Business justification for this request..." value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subcategory *</label>
            <select className="form-select" value={form.subcategory} onChange={e => setForm({ ...form, subcategory: e.target.value })} disabled={!subcategories.length}>
              <option value="">Select Subcategory</option>
              {subcategories.map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input className="form-input" type="number" min={1} value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })} />
          </div>
          <div className="form-group">
            <label className="form-label">Estimated Cost (₹) *</label>
            <input className="form-input" type="number" placeholder="0" value={form.estimatedCost} onChange={e => setForm({ ...form, estimatedCost: e.target.value })} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Required Date</label>
            <input className="form-input" type="date" value={form.requiredDate} onChange={e => setForm({ ...form, requiredDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" value={currentUser?.department || ''} disabled />
          </div>
        </div>

        {form.estimatedCost && (
          <div className="card" style={{ background: 'var(--bg-surface)', marginTop: 'var(--space-md)' }}>
            <div className="card-title" style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>Approval Chain Preview</div>
            <div className="workflow-steps">
              <div className="workflow-step active"><div className="workflow-step-icon">1</div><div className="workflow-step-label">Manager</div></div>
              {form.estimatedCost > 50000 && (<><div className="workflow-connector" /><div className="workflow-step"><div className="workflow-step-icon">2</div><div className="workflow-step-label">Sr. Manager</div></div></>)}
              {form.estimatedCost > 200000 && (<><div className="workflow-connector" /><div className="workflow-step"><div className="workflow-step-icon">3</div><div className="workflow-step-label">Head</div></div></>)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => handleSubmit('draft')}><Save size={16} /> Save Draft</button>
          <button className="btn btn-primary" onClick={() => handleSubmit('pending_manager')}><Send size={16} /> Submit Request</button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
