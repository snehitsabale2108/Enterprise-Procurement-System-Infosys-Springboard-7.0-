import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Building2, FileText, CheckCircle, Package, Clock, XCircle,
  Truck, Upload, ShieldCheck, DollarSign, AlertTriangle, Eye,
  Check, ArrowRight, RefreshCw, Star, Info, FileCode, CheckSquare,
  ChevronRight, Calendar, MapPin, Tag, Award
} from 'lucide-react';
import {
  getSupplierPortalStats,
  getSupplierRfqs,
  updateProductAvailability,
  declineRfq,
  submitQuotation,
  getSupplierQuotations,
  getSupplierPurchaseOrders,
  acceptPurchaseOrder,
  rejectPurchaseOrder,
  updateOrderStatus,
  uploadInvoice,
  getSupplierProfile,
  updateSupplierProfile
} from '../../services/supplierPortalService';
import { formatCurrency, getStatusBadgeClass, getStatusLabel } from '../../data/mockData';

const SupplierPortal = () => {
  const { currentUser } = useAuth();
  const supplierId = currentUser?.supplierId || 'S001'; // Default to TechnoHub for demo

  // Active Tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats & Data State
  const [stats, setStats] = useState({
    pendingRfqs: 0,
    submittedQuotations: 0,
    purchaseOrdersReceived: 0,
    activeOrders: 0,
    completedOrders: 0,
  });

  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Modals & Active Selections
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRejectPoModal, setShowRejectPoModal] = useState(false);
  const [selectedPo, setSelectedPo] = useState(null);

  // Form States
  const [quotationForm, setQuotationForm] = useState({
    unitPrice: '',
    estimatedDeliveryTime: '7 Days',
    warranty: '1 Year Warranty',
    remarks: '',
  });

  const [declineForm, setDeclineForm] = useState({
    reason: 'Out of Stock',
    remarks: '',
  });

  const [poRejectReason, setPoRejectReason] = useState('Cannot fulfill order on required schedule');

  const [invoiceForm, setInvoiceForm] = useState({
    invoiceNumber: '',
    invoiceAmount: '',
    fileName: '',
    fileUploaded: false,
  });

  const [profileForm, setProfileForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    ifsc: '',
  });

  // Quotation Filter
  const [quotationFilter, setQuotationFilter] = useState('all');
  const [rfqFilter, setRfqFilter] = useState('all');

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [sData, rData, qData, poData, pData] = await Promise.all([
        getSupplierPortalStats(supplierId),
        getSupplierRfqs(supplierId),
        getSupplierQuotations(supplierId),
        getSupplierPurchaseOrders(supplierId),
        getSupplierProfile(supplierId),
      ]);

      if (sData) setStats(sData);
      if (rData?.content) setRfqs(rData.content);
      if (qData) setQuotations(qData);
      if (poData?.content) setPurchaseOrders(poData.content);
      if (pData) {
        setProfile(pData);
        setProfileForm({
          companyName: pData.companyName || '',
          contactPerson: pData.contactPerson || '',
          email: pData.email || '',
          phone: pData.phone || '',
          address: pData.address || '',
          bankName: pData.bankName || '',
          accountNumber: pData.accountNumber || '',
          ifsc: pData.ifsc || '',
        });
      }
    } catch (err) {
      console.error('Failed to load supplier portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [supplierId]);

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  // Availability Toggle
  const handleAvailabilityToggle = async (rfqId, currentAvail) => {
    const newAvail = currentAvail === 'Available' ? 'Out of Stock' : 'Available';
    await updateProductAvailability(rfqId, newAvail);
    showToast(`Updated product availability to: ${newAvail}`);
    loadData();
  };

  // Open Decline Modal
  const openDeclineModal = (rfq) => {
    setSelectedRfq(rfq);
    setDeclineForm({ reason: 'Out of Stock', remarks: '' });
    setShowDeclineModal(true);
  };

  // Submit Decline RFQ
  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRfq) return;
    await declineRfq(selectedRfq.id, declineForm.reason, declineForm.remarks);
    setShowDeclineModal(false);
    showToast(`RFQ ${selectedRfq.rfqNumber || selectedRfq.id} declined.`);
    loadData();
  };

  // Open Submit Quotation Modal
  const openQuotationModal = (rfq) => {
    setSelectedRfq(rfq);
    setQuotationForm({
      unitPrice: '',
      estimatedDeliveryTime: '7 Days',
      warranty: '1 Year Onsite Warranty',
      remarks: '',
    });
    setShowQuotationModal(true);
  };

  // Submit Quotation
  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRfq) return;
    const uPrice = parseFloat(quotationForm.unitPrice) || 0;
    if (uPrice <= 0) {
      alert('Please enter a valid unit price');
      return;
    }

    const payload = {
      rfqId: selectedRfq.id,
      requestId: selectedRfq.requestId,
      supplierId: supplierId,
      supplierName: profile?.companyName || 'Supplier',
      unitPrice: uPrice,
      items: [{ name: selectedRfq.itemName, unitPrice: uPrice, quantity: selectedRfq.quantity }],
      totalAmount: uPrice * selectedRfq.quantity,
      estimatedDeliveryTime: quotationForm.estimatedDeliveryTime,
      warranty: quotationForm.warranty,
      remarks: quotationForm.remarks,
    };

    await submitQuotation(payload);
    setShowQuotationModal(false);
    showToast(`Quotation submitted successfully for ${selectedRfq.itemName}!`);
    loadData();
  };

  // Accept PO
  const handleAcceptPo = async (poId) => {
    await acceptPurchaseOrder(poId);
    showToast(`Purchase Order ${poId} accepted.`);
    loadData();
  };

  // Reject PO
  const openRejectPoModal = (po) => {
    setSelectedPo(po);
    setPoRejectReason('Cannot fulfill order on required schedule');
    setShowRejectPoModal(true);
  };

  const handleRejectPoSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPo) return;
    await rejectPurchaseOrder(selectedPo.id, poRejectReason);
    setShowRejectPoModal(false);
    showToast(`Purchase Order ${selectedPo.id} rejected.`);
    loadData();
  };

  // Update Fulfillment Order Status
  const handleStatusUpdate = async (poId, newStatus) => {
    await updateOrderStatus(poId, newStatus);
    showToast(`Order status updated to: ${newStatus.toUpperCase()}`);
    loadData();
  };

  // Open Invoice Modal
  const openInvoiceModal = (po) => {
    setSelectedPo(po);
    setInvoiceForm({
      invoiceNumber: `INV-${po.id.replace('PO-', '')}`,
      invoiceAmount: po.totalAmount || '',
      fileName: `Invoice_${po.id}.pdf`,
      fileUploaded: true,
    });
    setShowInvoiceModal(true);
  };

  // Submit Invoice
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPo) return;
    await uploadInvoice(selectedPo.id, {
      invoiceNumber: invoiceForm.invoiceNumber,
      invoiceAmount: parseFloat(invoiceForm.invoiceAmount) || selectedPo.totalAmount,
      invoiceFileName: invoiceForm.fileName,
    });
    setShowInvoiceModal(false);
    showToast(`Invoice ${invoiceForm.invoiceNumber} uploaded successfully for ${selectedPo.id}!`);
    loadData();
  };

  // Save Profile
  const handleProfileSave = async (e) => {
    e.preventDefault();
    await updateSupplierProfile(supplierId, profileForm);
    showToast('Company profile updated successfully.');
    loadData();
  };

  // Filtered Quotations
  const filteredQuotations = quotations.filter(q => {
    if (quotationFilter === 'all') return true;
    return q.status === quotationFilter;
  });

  // Filtered RFQs
  const filteredRfqs = rfqs.filter(r => {
    if (rfqFilter === 'all') return true;
    return r.status === rfqFilter;
  });

  return (
    <div className="page" style={{ paddingBottom: 60 }}>
      {/* Toast message */}
      {message && (
        <div style={{
          position: 'fixed', top: 20, right: 20, zIndex: 9999,
          background: 'var(--success, #10b981)', color: '#fff',
          padding: '12px 24px', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      )}

      {/* Supplier Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.12) 100%)',
        border: '1px solid rgba(99,102,241,0.2)',
        marginBottom: 'var(--space-xl)', padding: 'var(--space-xl)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14, background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              fontWeight: 800, fontSize: 22, boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
            }}>
              {profile?.companyName ? profile.companyName.charAt(0) : 'S'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h1 style={{ margin: 0, fontSize: 'var(--font-2xl)', fontWeight: 800 }}>
                  {profile?.companyName || 'Supplier Portal'}
                </h1>
                <span className="badge badge-success" style={{ gap: 4 }}>
                  <ShieldCheck size={14} /> KYC Approved
                </span>
                <span className="badge badge-info">Equipment & Furniture Vendor</span>
              </div>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                Welcome to your EPS Supplier Workspace • Isolated Vendor Account ({supplierId})
              </p>
            </div>
          </div>

          <button className="btn btn-outline btn-sm" onClick={loadData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh Portal
          </button>
        </div>
      </div>

      {/* Supplier Navigation Tabs */}
      <div style={{
        display: 'flex', gap: 8, borderBottom: '1px solid var(--border-color)',
        marginBottom: 'var(--space-xl)', overflowX: 'auto', paddingBottom: 2
      }}>
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Building2 },
          { id: 'rfqs', label: `RFQs (${rfqs.filter(r => r.status === 'pending').length})`, icon: FileText },
          { id: 'quotations', label: 'Submitted Quotations', icon: CheckSquare },
          { id: 'orders', label: `Purchase Orders (${purchaseOrders.length})`, icon: Package },
          { id: 'invoices', label: 'Upload Invoice', icon: Upload },
          { id: 'profile', label: 'Company Profile & KYC', icon: Award },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: '8px 8px 0 0',
                border: 'none', borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
                background: active ? 'var(--card-bg)' : 'transparent',
                color: active ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: active ? 700 : 500, cursor: 'pointer',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gap: 'var(--space-xl)' }}>
          {/* Stat Cards */}
          <div className="grid grid-3 gap-md">
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #f59e0b' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pending RFQs</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{stats.pendingRfqs}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #6366f1' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Submitted Quotations</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{stats.submittedQuotations}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #8b5cf6' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>POs Received</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{stats.purchaseOrdersReceived}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #06b6d4' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(6,182,212,0.15)', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Orders</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{stats.activeOrders}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #10b981' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Completed Orders</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{stats.completedOrders}</div>
              </div>
            </div>

            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, borderLeft: '4px solid #ec4899' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(236,72,153,0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={24} />
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Supplier Rating</div>
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-main)' }}>{profile?.rating || 4.5} / 5.0</div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Supplier Quick Workflow Actions</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button className="btn btn-primary" onClick={() => setActiveTab('rfqs')}>
                <FileText size={18} /> View Pending RFQs ({stats.pendingRfqs})
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('orders')}>
                <Package size={18} /> Manage Purchase Orders ({stats.purchaseOrdersReceived})
              </button>
              <button className="btn btn-outline" onClick={() => setActiveTab('invoices')}>
                <Upload size={18} /> Upload PO Invoice
              </button>
              <button className="btn btn-ghost" onClick={() => setActiveTab('profile')}>
                <Award size={18} /> View KYC Status
              </button>
            </div>
          </div>

          {/* Recent Pending RFQs Overview */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
              <div className="card-title">Pending Quotation Requests (RFQs)</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('rfqs')}>
                View All RFQs <ChevronRight size={16} />
              </button>
            </div>

            {rfqs.filter(r => r.status === 'pending').length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={40} color="var(--success)" />
                <p style={{ marginTop: 8 }}>All RFQs processed! No pending quotation requests.</p>
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>RFQ #</th>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Required Date</th>
                      <th>Delivery Location</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rfqs.filter(r => r.status === 'pending').map(r => (
                      <tr key={r.id}>
                        <td style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{r.rfqNumber || r.id}</td>
                        <td style={{ fontWeight: 600 }}>{r.itemName}</td>
                        <td>{r.quantity}</td>
                        <td>{r.requiredDeliveryDate}</td>
                        <td>{r.deliveryLocation}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${r.productAvailability === 'Available' ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => handleAvailabilityToggle(r.id, r.productAvailability)}
                            title="Click to toggle availability"
                          >
                            {r.productAvailability || 'Available'}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-primary btn-sm" onClick={() => openQuotationModal(r)}>
                              Submit Quote
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => openDeclineModal(r)}>
                              Decline
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 1: VIEW RFQs & AVAILABILITY & DECLINE ── */}
      {activeTab === 'rfqs' && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'pending', 'quoted', 'declined'].map(st => (
                <button
                  key={st}
                  className={`btn btn-sm ${rfqFilter === st ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setRfqFilter(st)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st} RFQs
                </button>
              ))}
            </div>

            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Showing {filteredRfqs.length} quotation request(s)
            </span>
          </div>

          <div className="card">
            {filteredRfqs.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} color="var(--text-muted)" />
                <h3>No RFQs found</h3>
                <p>No quotation requests match your filter.</p>
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>RFQ Number</th>
                      <th>Item Name</th>
                      <th>Qty</th>
                      <th>Required Date</th>
                      <th>Location</th>
                      <th>Submission Deadline</th>
                      <th>Product Availability</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRfqs.map(rfq => (
                      <tr key={rfq.id}>
                        <td style={{ fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'monospace' }}>
                          {rfq.rfqNumber || rfq.id}
                        </td>
                        <td style={{ fontWeight: 600 }}>{rfq.itemName}</td>
                        <td>{rfq.quantity}</td>
                        <td>{rfq.requiredDeliveryDate}</td>
                        <td><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} />{rfq.deliveryLocation}</div></td>
                        <td>
                          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--danger)' }}>
                            <Calendar size={12} style={{ marginRight: 4 }} />
                            {rfq.submissionDeadline}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`badge ${rfq.productAvailability === 'Available' ? 'badge-success' : 'badge-danger'}`}
                            style={{ cursor: rfq.status === 'pending' ? 'pointer' : 'default', border: 'none' }}
                            onClick={() => rfq.status === 'pending' && handleAvailabilityToggle(rfq.id, rfq.productAvailability)}
                          >
                            {rfq.productAvailability || 'Available'}
                          </button>
                        </td>
                        <td>
                          <span className={`badge ${
                            rfq.status === 'quoted' ? 'badge-success' :
                            rfq.status === 'declined' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {rfq.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          {rfq.status === 'pending' ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-primary btn-sm" onClick={() => openQuotationModal(rfq)}>
                                Submit Quotation
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => openDeclineModal(rfq)}>
                                Decline RFQ
                              </button>
                            </div>
                          ) : rfq.status === 'declined' ? (
                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                              Reason: {rfq.declineReason || 'Out of stock'}
                            </span>
                          ) : (
                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--success)', fontWeight: 600 }}>
                              Quotation Submitted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 2: SUBMITTED QUOTATIONS ── */}
      {activeTab === 'quotations' && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <div className="filter-bar" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'pending', 'accepted', 'rejected'].map(st => (
                <button
                  key={st}
                  className={`btn btn-sm ${quotationFilter === st ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setQuotationFilter(st)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {st === 'accepted' ? 'Selected' : st}
                </button>
              ))}
            </div>

            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Total {filteredQuotations.length} quotation(s)
            </span>
          </div>

          <div className="card">
            {filteredQuotations.length === 0 ? (
              <div className="empty-state">
                <CheckSquare size={48} color="var(--text-muted)" />
                <h3>No quotations submitted yet</h3>
                <p>Respond to pending RFQs in the RFQs tab to submit pricing.</p>
              </div>
            ) : (
              <div className="table-container" style={{ border: 'none' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Quote ID</th>
                      <th>RFQ ID</th>
                      <th>Item Description</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                      <th>Est. Delivery</th>
                      <th>Warranty</th>
                      <th>Submission Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotations.map(q => (
                      <tr key={q.id}>
                        <td style={{ fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'monospace' }}>{q.id}</td>
                        <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{q.rfqId || q.requestId}</td>
                        <td style={{ fontWeight: 600 }}>{q.items?.[0]?.name || 'Equipment Item'}</td>
                        <td>{formatCurrency(q.unitPrice || (q.totalAmount / (q.items?.[0]?.quantity || 1)))}</td>
                        <td style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(q.totalAmount)}</td>
                        <td>{q.estimatedDeliveryTime || '7 Days'}</td>
                        <td>{q.warranty || '1 Year'}</td>
                        <td>{q.submittedAt}</td>
                        <td>
                          <span className={`badge ${
                            q.status === 'accepted' ? 'badge-success' :
                            q.status === 'rejected' ? 'badge-danger' : 'badge-warning'
                          }`}>
                            {q.status === 'accepted' ? 'SELECTED' : q.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: PURCHASE ORDERS & FULFILLMENT STATUS ── */}
      {activeTab === 'orders' && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Received Purchase Orders</div>

            {purchaseOrders.length === 0 ? (
              <div className="empty-state">
                <Package size={48} color="var(--text-muted)" />
                <h3>No Purchase Orders received yet</h3>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                {purchaseOrders.map(po => (
                  <div key={po.id} style={{
                    border: '1px solid var(--border-color)', borderRadius: 12, padding: 'var(--space-lg)',
                    background: 'var(--card-bg)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 'var(--font-lg)', fontWeight: 800, color: 'var(--primary-light)' }}>
                            {po.id}
                          </span>
                          <span className={`badge ${getStatusBadgeClass(po.status)}`}>
                            {po.status.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                          Created on {po.createdAt} • Request Ref: {po.requestId}
                        </p>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800, color: 'var(--success)' }}>
                          {formatCurrency(po.totalAmount)}
                        </div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                          Subtotal: {formatCurrency(po.subtotal)} + Tax (18%): {formatCurrency(po.tax)}
                        </div>
                      </div>
                    </div>

                    <div style={{ margin: 'var(--space-md) 0', padding: 'var(--space-md)', background: 'var(--bg-main)', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>
                        Order Line Items:
                      </div>
                      {po.items?.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', margin: '4px 0' }}>
                          <span>{item.name} (Qty: {item.quantity})</span>
                          <span style={{ fontWeight: 600 }}>{formatCurrency(item.total || item.unitPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Status Progress Pipeline */}
                    {['accepted', 'processing', 'packed', 'shipped', 'delivered'].includes(po.status) && (
                      <div style={{ margin: 'var(--space-md) 0', padding: 'var(--space-md)', background: 'rgba(99,102,241,0.04)', borderRadius: 8, border: '1px border-subtle' }}>
                        <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>
                          Order Fulfillment Pipeline Status:
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {['processing', 'packed', 'shipped', 'delivered'].map(st => (
                            <button
                              key={st}
                              className={`btn btn-sm ${po.status === st ? 'btn-primary' : 'btn-outline'}`}
                              onClick={() => handleStatusUpdate(po.id, st)}
                              style={{ textTransform: 'capitalize', fontSize: 'var(--font-xs)' }}
                            >
                              Mark as {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 'var(--space-md)' }}>
                      <div>
                        {po.invoiceNumber ? (
                          <span className="badge badge-success" style={{ gap: 4 }}>
                            <CheckCircle size={14} /> Invoice Uploaded ({po.invoiceNumber})
                          </span>
                        ) : (
                          <button className="btn btn-outline btn-sm" onClick={() => openInvoiceModal(po)}>
                            <Upload size={14} /> Upload Invoice PDF
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {po.status === 'sent' && (
                          <>
                            <button className="btn btn-success btn-sm" onClick={() => handleAcceptPo(po.id)}>
                              <Check size={16} /> Accept Purchase Order
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => openRejectPoModal(po)}>
                              <XCircle size={16} /> Reject Purchase Order
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TAB 4: UPLOAD INVOICE ── */}
      {activeTab === 'invoices' && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)', maxWidth: 800 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Upload Order Invoice</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-lg)' }}>
              Upload invoice PDF documents for your active/accepted purchase orders for Finance team verification and payment processing.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (!selectedPo) { alert('Please select a purchase order'); return; }
              handleInvoiceSubmit(e);
            }}>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Select Purchase Order</label>
                <select
                  className="form-select"
                  value={selectedPo?.id || ''}
                  onChange={(e) => {
                    const po = purchaseOrders.find(p => p.id === e.target.value);
                    if (po) openInvoiceModal(po);
                  }}
                >
                  <option value="">-- Select PO --</option>
                  {purchaseOrders.map(po => (
                    <option key={po.id} value={po.id}>
                      {po.id} - {po.items?.[0]?.name} ({formatCurrency(po.totalAmount)})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPo && (
                <>
                  <div className="grid grid-2 gap-md" style={{ marginBottom: 'var(--space-md)' }}>
                    <div className="form-group">
                      <label className="form-label">Invoice Number *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={invoiceForm.invoiceNumber}
                        onChange={e => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                        placeholder="e.g. INV-2024-881"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Invoice Amount (INR) *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={invoiceForm.invoiceAmount}
                        onChange={e => setInvoiceForm({ ...invoiceForm, invoiceAmount: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Drag and Drop PDF simulated uploader */}
                  <div style={{
                    border: '2px dashed var(--primary)', borderRadius: 12, padding: 'var(--space-xl)',
                    textAlign: 'center', background: 'rgba(99,102,241,0.03)', marginBottom: 'var(--space-lg)'
                  }}>
                    <Upload size={36} color="var(--primary)" style={{ marginBottom: 8 }} />
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {invoiceForm.fileName ? invoiceForm.fileName : 'Click or Drag Invoice PDF here'}
                    </div>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                      Supported formats: PDF (Max size: 10MB)
                    </span>
                  </div>

                  <button type="submit" className="btn btn-primary">
                    <Upload size={18} /> Submit Invoice to Finance
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 5: COMPANY PROFILE & KYC ── */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gap: 'var(--space-lg)', maxWidth: 900 }}>
          <div className="grid grid-2 gap-lg">
            {/* Profile Form */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>Company Information</div>
              <form onSubmit={handleProfileSave}>
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Company Name</label>
                  <input
                    type="text" className="form-control"
                    value={profileForm.companyName}
                    onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text" className="form-control"
                    value={profileForm.contactPerson}
                    onChange={e => setProfileForm({ ...profileForm, contactPerson: e.target.value })}
                  />
                </div>

                <div className="grid grid-2 gap-md" style={{ marginBottom: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email" className="form-control"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text" className="form-control"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control" rows={2}
                    value={profileForm.address}
                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                  />
                </div>

                <div className="card-title" style={{ margin: '16px 0 12px', fontSize: 'var(--font-md)' }}>Bank Details</div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text" className="form-control"
                    value={profileForm.bankName}
                    onChange={e => setProfileForm({ ...profileForm, bankName: e.target.value })}
                  />
                </div>

                <div className="grid grid-2 gap-md" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Account Number</label>
                    <input
                      type="text" className="form-control"
                      value={profileForm.accountNumber}
                      onChange={e => setProfileForm({ ...profileForm, accountNumber: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">IFSC Code</label>
                    <input
                      type="text" className="form-control"
                      value={profileForm.ifsc}
                      onChange={e => setProfileForm({ ...profileForm, ifsc: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">Save Profile</button>
              </form>
            </div>

            {/* KYC Status View */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 'var(--space-md)' }}>KYC Documents Status</div>
              <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                View-Only mode after Admin Approval. Contact system administrator for updates.
              </p>

              <div style={{
                background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                padding: 'var(--space-md)', borderRadius: 8, marginBottom: 'var(--space-lg)',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <ShieldCheck size={28} color="var(--success)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>KYC Verified & Approved</div>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                    Your vendor status is ACTIVE. Full access to bid on Equipment & Furniture RFQs.
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--bg-main)', borderRadius: 6 }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>GSTIN Number</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{profile?.gstNumber || '29AABCT1234F1Z5'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--bg-main)', borderRadius: 6 }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>PAN Number</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{profile?.panNumber || 'AABCT1234F'}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--bg-main)', borderRadius: 6 }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>GST Certificate</span>
                  <span className="badge badge-success" style={{ gap: 4 }}><Check size={12} /> Verified PDF</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--bg-main)', borderRadius: 6 }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>PAN Card Copy</span>
                  <span className="badge badge-success" style={{ gap: 4 }}><Check size={12} /> Verified PDF</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: 'var(--bg-main)', borderRadius: 6 }}>
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Cancelled Cheque</span>
                  <span className="badge badge-success" style={{ gap: 4 }}><Check size={12} /> Verified PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: SUBMIT QUOTATION ── */}
      {showQuotationModal && selectedRfq && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 550, width: '100%', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Submit Quotation</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowQuotationModal(false)}>✕</button>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-main)', borderRadius: 8, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>{selectedRfq.itemName}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                RFQ #{selectedRfq.rfqNumber || selectedRfq.id} • Qty: {selectedRfq.quantity} • Delivery to {selectedRfq.deliveryLocation}
              </div>
            </div>

            <form onSubmit={handleQuotationSubmit}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Unit Price (INR) *</label>
                <input
                  type="number"
                  className="form-control"
                  value={quotationForm.unitPrice}
                  onChange={e => setQuotationForm({ ...quotationForm, unitPrice: e.target.value })}
                  placeholder="Enter price per unit"
                  required
                />
              </div>

              {quotationForm.unitPrice && (
                <div style={{
                  fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--success)',
                  marginBottom: 12, padding: 8, background: 'rgba(16,185,129,0.08)', borderRadius: 6
                }}>
                  Total Quote Amount: {formatCurrency(parseFloat(quotationForm.unitPrice) * selectedRfq.quantity)}
                </div>
              )}

              <div className="grid grid-2 gap-md" style={{ marginBottom: 12 }}>
                <div className="form-group">
                  <label className="form-label">Est. Delivery Time</label>
                  <input
                    type="text"
                    className="form-control"
                    value={quotationForm.estimatedDeliveryTime}
                    onChange={e => setQuotationForm({ ...quotationForm, estimatedDeliveryTime: e.target.value })}
                    placeholder="e.g. 7 Days"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Warranty (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={quotationForm.warranty}
                    onChange={e => setQuotationForm({ ...quotationForm, warranty: e.target.value })}
                    placeholder="e.g. 1 Year Warranty"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Remarks / Terms</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={quotationForm.remarks}
                  onChange={e => setQuotationForm({ ...quotationForm, remarks: e.target.value })}
                  placeholder="Additional terms or notes"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowQuotationModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Quotation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: DECLINE RFQ ── */}
      {showDeclineModal && selectedRfq && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%', animation: 'fadeIn 0.2s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: 'var(--danger)' }}>Decline Quotation Request</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDeclineModal(false)}>✕</button>
            </div>

            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 16 }}>
              You are declining RFQ #{selectedRfq.rfqNumber || selectedRfq.id} for <strong>{selectedRfq.itemName}</strong>.
            </p>

            <form onSubmit={handleDeclineSubmit}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Decline Reason *</label>
                <select
                  className="form-select"
                  value={declineForm.reason}
                  onChange={e => setDeclineForm({ ...declineForm, reason: e.target.value })}
                >
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Product Discontinued">Product Discontinued</option>
                  <option value="Cannot Meet Delivery Date">Cannot Meet Delivery Date</option>
                  <option value="Price Not Available">Price Not Available</option>
                  <option value="Other (Remarks)">Other (Remarks)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={declineForm.remarks}
                  onChange={e => setDeclineForm({ ...declineForm, remarks: e.target.value })}
                  placeholder="Provide additional context for declining this RFQ"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowDeclineModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Confirm Decline</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: REJECT PO ── */}
      {showRejectPoModal && selectedPo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 500, width: '100%' }}>
            <h3 style={{ marginTop: 0, color: 'var(--danger)' }}>Reject Purchase Order {selectedPo.id}</h3>
            <form onSubmit={handleRejectPoSubmit}>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Rejection Reason</label>
                <textarea
                  className="form-control" rows={3}
                  value={poRejectReason}
                  onChange={e => setPoRejectReason(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowRejectPoModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Reject Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD INVOICE ── */}
      {showInvoiceModal && selectedPo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div className="card" style={{ maxWidth: 550, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Upload Invoice for {selectedPo.id}</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowInvoiceModal(false)}>✕</button>
            </div>

            <form onSubmit={handleInvoiceSubmit}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Invoice Number *</label>
                <input
                  type="text" className="form-control"
                  value={invoiceForm.invoiceNumber}
                  onChange={e => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label className="form-label">Invoice Amount (INR) *</label>
                <input
                  type="number" className="form-control"
                  value={invoiceForm.invoiceAmount}
                  onChange={e => setInvoiceForm({ ...invoiceForm, invoiceAmount: e.target.value })}
                  required
                />
              </div>

              <div style={{
                border: '2px dashed var(--primary)', borderRadius: 10, padding: 20,
                textAlign: 'center', background: 'rgba(99,102,241,0.03)', marginBottom: 16
              }}>
                <Upload size={32} color="var(--primary)" style={{ marginBottom: 6 }} />
                <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)' }}>
                  {invoiceForm.fileName || 'Click to select PDF document'}
                </div>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>PDF, Max 10MB</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowInvoiceModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Upload & Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierPortal;
