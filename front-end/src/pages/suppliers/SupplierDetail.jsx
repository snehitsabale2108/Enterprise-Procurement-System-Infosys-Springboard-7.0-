import { useParams, useNavigate } from 'react-router-dom';
import { suppliers } from '../../data/mockData';
import { ArrowLeft, Building2, Phone, Mail, MapPin, Star, CreditCard, FileText } from 'lucide-react';

const SupplierDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const supplier = suppliers.find(s => s.id === id);
  if (!supplier) return <div className="page"><div className="empty-state"><h3>Supplier not found</h3></div></div>;

  const info = [
    { icon: Building2, label: 'Business Type', value: supplier.businessType },
    { icon: FileText, label: 'GST Number', value: supplier.gstNumber },
    { icon: FileText, label: 'PAN Number', value: supplier.panNumber },
    { icon: Phone, label: 'Phone', value: supplier.phone },
    { icon: Mail, label: 'Email', value: supplier.email },
    { icon: MapPin, label: 'Address', value: supplier.address },
  ];

  return (
    <div className="page" style={{ maxWidth: 900 }}>
      <button className="btn btn-ghost" onClick={() => navigate(-1)}><ArrowLeft size={18} /> Back</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: 'var(--space-lg) 0 var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>{supplier.companyName}</h1>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)', alignItems: 'center' }}>
            <span className={`badge ${supplier.status === 'active' ? 'badge-success' : 'badge-danger'}`}>{supplier.status}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}><Star size={14} color="#f59e0b" fill="#f59e0b" />{supplier.rating} • {supplier.totalOrders} orders</span>
          </div>
        </div>
      </div>
      <div className="grid grid-2 gap-lg">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Company Information</div>
          {info.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)' }}>
              <item.icon size={16} color="var(--text-muted)" style={{ marginTop: 2 }} />
              <div><div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</div><div style={{ fontWeight: 500 }}>{item.value}</div></div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Bank Details</div>
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {[{ label: 'Bank Name', value: supplier.bankName }, { label: 'Account Number', value: supplier.accountNumber }, { label: 'IFSC Code', value: supplier.ifsc }].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <CreditCard size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', minWidth: 120, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.label}</span>
                <span style={{ fontWeight: 500, fontFamily: 'monospace' }}>{item.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-success btn-sm">Approve</button>
            <button className="btn btn-warning btn-sm">Suspend</button>
            <button className="btn btn-danger btn-sm">Blacklist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetail;
