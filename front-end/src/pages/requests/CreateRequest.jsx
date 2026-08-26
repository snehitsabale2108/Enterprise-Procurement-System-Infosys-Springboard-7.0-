import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { categories, formatCurrency, formatDateTime } from '../../data/mockData';
import {
  approvalLevelsFor,
  createRequest,
  getRequest,
  isRequestEditable,
  submitRequest,
  updateRequest,
  suggestCategory,
  validateItemCategory,
} from '../../store/epsStore';
import { Save, Send, ArrowLeft, AlertTriangle } from 'lucide-react';

const ROLE_LABELS = { manager: 'Manager', senior_manager: 'Sr. Manager', head: 'Head' };

const emptyForm = {
  title: '', description: '', reason: '', category: '', subcategory: '',
  quantity: 1, estimatedCost: '', requiredDate: '', priority: 'medium',
};

/**
 * Create a new request, or edit a draft / returned request.
 * A request returned by anyone in the approval chain becomes editable again
 * and is resubmitted from here, keeping its original ID and history.
 */
const CreateRequest = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const existing = id ? getRequest(id) : null;
  const [form, setForm] = useState(emptyForm);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!existing) return;
    setForm({
      title: existing.title || '',
      description: existing.description || '',
      reason: existing.reason || '',
      category: existing.category || '',
      subcategory: existing.subcategory || '',
      quantity: existing.quantity || 1,
      estimatedCost: existing.estimatedCost ?? '',
      requiredDate: existing.requiredDate || '',
      priority: existing.priority || 'medium',
    });
    const cat = categories.find((c) => c.name === existing.category);
    setSubcategories(cat ? cat.subcategories : []);
  }, [existing]);

  const editable = existing ? isRequestEditable(existing, currentUser) : true;
  const levels = useMemo(() => approvalLevelsFor(form.estimatedCost), [form.estimatedCost]);

  // e.g. typing "MacBook Pro" pins the request to Equipment & Assets → Laptop
  const suggested = useMemo(() => suggestCategory(form.title), [form.title]);
  const categoryMismatch = !!suggested
    && !!form.category
    && (form.category !== suggested.category || form.subcategory !== suggested.subcategory);

  const applySuggestion = () => {
    const cat = categories.find((c) => c.name === suggested.category);
    setSubcategories(cat ? cat.subcategories : []);
    setForm((prev) => ({ ...prev, category: suggested.category, subcategory: suggested.subcategory }));
  };

  const handleCategoryChange = (e) => {
    const cat = categories.find((c) => c.name === e.target.value);
    setForm({ ...form, category: e.target.value, subcategory: '' });
    setSubcategories(cat ? cat.subcategories : []);
  };

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.description.trim()) return 'Description is required.';
    if (!form.reason.trim()) return 'Justification is required.';
    if (!form.category || !form.subcategory) return 'Category and subcategory are required.';
    const categoryProblem = validateItemCategory(form);
    if (categoryProblem) return categoryProblem;
    if (!Number(form.estimatedCost)) return 'Estimated cost must be greater than zero.';
    return '';
  };

  const handleSubmit = (mode) => {
    const problem = validate();
    if (problem) { setError(problem); return; }
    setError('');
    try {
      if (existing) {
        updateRequest(existing.id, form, currentUser);
        if (mode === 'submit') submitRequest(existing.id, currentUser);
        navigate(`/requests/${existing.id}`);
      } else {
        const created = createRequest(form, currentUser, { submit: mode === 'submit' });
        navigate(`/requests/${created.id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (id && !existing) {
    return <div className="page"><div className="empty-state"><h3>Request not found</h3></div></div>;
  }

  if (existing && !editable) {
    return (
      <div className="page">
        <button className="btn btn-ghost" onClick={() => navigate(`/requests/${existing.id}`)}>
          <ArrowLeft size={18} /> Back to Request
        </button>
        <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
          <div className="empty-state">
            <AlertTriangle size={40} />
            <h3>This request can no longer be edited</h3>
            <p>Only your own draft or returned requests are editable.</p>
          </div>
        </div>
      </div>
    );
  }

  const isReturned = existing?.status === 'returned';

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <div className="page-header">
        <button className="btn btn-ghost" onClick={() => navigate('/requests')}>
          <ArrowLeft size={18} /> Back to Requests
        </button>
        <h1 style={{ marginTop: 'var(--space-md)' }}>
          {existing ? `Edit Request ${existing.id}` : 'Create Procurement Request'}
        </h1>
        <p>
          {isReturned
            ? 'This request was returned for correction. Update it and resubmit for approval.'
            : 'Fill in the details for your procurement request'}
        </p>
      </div>

      {isReturned && (
        <div className="card" style={{ borderLeft: '3px solid var(--warning)', marginBottom: 'var(--space-lg)' }}>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} color="var(--warning)" /> Returned by {existing.returnedBy} ({existing.returnedByRole?.replace(/_/g, ' ')})
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>{existing.returnComments}</p>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            {formatDateTime(existing.returnedAt)}
          </span>
        </div>
      )}

      <div className="card">
        {error && (
          <div className="card" style={{ background: 'var(--bg-surface)', borderLeft: '3px solid var(--danger)', marginBottom: 'var(--space-md)' }}>
            <p style={{ color: 'var(--danger)', fontSize: 'var(--font-sm)' }}>{error}</p>
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" placeholder="e.g. MacBook Pro 16 inch" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" placeholder="Describe what you need and why..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>

        <div className="form-group">
          <label className="form-label">Justification / Reason *</label>
          <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Business justification for this request..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select className="form-select" value={form.category} onChange={handleCategoryChange}>
              <option value="">Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Subcategory *</label>
            <select className="form-select" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} disabled={!subcategories.length}>
              <option value="">Select Subcategory</option>
              {subcategories.map((sc) => <option key={sc} value={sc}>{sc}</option>)}
            </select>
          </div>
        </div>

        {suggested && (
          <div
            className="card"
            data-testid="category-hint"
            style={{ background: 'var(--bg-surface)', borderLeft: `3px solid var(--${categoryMismatch ? 'danger' : 'success'})`, marginBottom: 'var(--space-md)' }}
          >
            <p style={{ fontSize: 'var(--font-sm)', color: categoryMismatch ? 'var(--danger)' : 'var(--text-secondary)' }}>
              {categoryMismatch
                ? `This looks like a ${suggested.subcategory.toLowerCase()} item — it must be raised under ${suggested.category} → ${suggested.subcategory}.`
                : `Category matches the item type (${suggested.category} → ${suggested.subcategory}).`}
            </p>
            {categoryMismatch && (
              <button type="button" className="btn btn-sm btn-outline" style={{ marginTop: 'var(--space-sm)' }} onClick={applySuggestion}>
                Use {suggested.subcategory} category
              </button>
            )}
          </div>
        )}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input className="form-input" type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value, 10) || 1 })} />
          </div>
          <div className="form-group">
            <label className="form-label">Estimated Cost (₹) *</label>
            <input className="form-input" type="number" placeholder="0" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Required Date</label>
            <input className="form-input" type="date" value={form.requiredDate} onChange={(e) => setForm({ ...form, requiredDate: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Department</label>
            <input className="form-input" value={existing?.department || currentUser?.department || ''} disabled />
          </div>
        </div>

        {!!Number(form.estimatedCost) && (
          <div className="card" style={{ background: 'var(--bg-surface)', marginTop: 'var(--space-md)' }}>
            <div className="card-title" style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--space-sm)' }}>
              Approval Chain Preview — {formatCurrency(Number(form.estimatedCost))}
            </div>
            <div className="workflow-steps">
              {levels.map((level, i) => (
                <div key={level} style={{ display: 'contents' }}>
                  {i > 0 && <div className="workflow-connector" />}
                  <div className={`workflow-step ${i === 0 ? 'active' : ''}`}>
                    <div className="workflow-step-icon">{i + 1}</div>
                    <div className="workflow-step-label">{ROLE_LABELS[level] || level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)', justifyContent: 'flex-end' }}>
          <button className="btn btn-secondary" onClick={() => handleSubmit('draft')}>
            <Save size={16} /> {existing ? 'Save Changes' : 'Save Draft'}
          </button>
          <button className="btn btn-primary" onClick={() => handleSubmit('submit')}>
            <Send size={16} /> {isReturned ? 'Resubmit for Approval' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
