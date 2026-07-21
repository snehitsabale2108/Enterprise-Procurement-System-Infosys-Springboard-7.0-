// --- EPS Executive Dashboard Application State ---
const state = {
  theme: 'dark',
  activeTab: 'dashboard',
  selectedRequestId: null,
  selectedAction: null,
  
  // Department Budgets Data
  departments: [
    { id: 1, name: 'IT Department', code: 'CC-IT-001', allocated: 800000, actual: 320000, committed: 180000 },
    { id: 2, name: 'HR Department', code: 'CC-HR-002', allocated: 250000, actual: 110000, committed: 40000 },
    { id: 3, name: 'Finance Department', code: 'CC-FIN-003', allocated: 150000, actual: 45000, committed: 25000 },
    { id: 4, name: 'Operations Department', code: 'CC-OPS-004', allocated: 600000, actual: 240000, committed: 150000 },
    { id: 5, name: 'Marketing Department', code: 'CC-MKT-005', allocated: 300000, actual: 195000, committed: 65000 }
  ],

  // Suppliers Data
  suppliers: [
    { id: 1, name: 'TechCorp Solutions', email: 'sales@techcorp.com', phone: '+1-555-0199', address: '100 Silicon Valley Way, CA', status: 'Active', kycExpiry: '2027-12-31', rating: 4.8 },
    { id: 2, name: 'OfficeDepot Inc', email: 'support@officedepot.com', phone: '+1-555-0122', address: '456 Business Road, NY', status: 'Active', kycExpiry: '2026-09-15', rating: 4.5 },
    { id: 3, name: 'Apex Logistics', email: 'contracts@apexlogistics.com', phone: '+1-555-0188', address: '789 Transport Drive, TX', status: 'Active', kycExpiry: '2026-08-01', rating: 4.2 },
    { id: 4, name: 'Global Consulting', email: 'contact@globalconsulting.com', phone: '+1-555-0177', address: '12 Wealth St, London, UK', status: 'Suspended', kycExpiry: '2026-03-31', rating: 3.5 },
    { id: 5, name: 'CyberDyne Systems', email: 'defense@cyberdyne.co', phone: '+1-555-0100', address: '800 Skynet Blvd, NM', status: 'Blacklisted', kycExpiry: '2025-12-31', rating: 1.2 }
  ],

  // Purchase Requests
  requests: [
    {
      id: 1,
      requester: 'John Doe',
      departmentId: 1, // IT
      item: 'Enterprise Rack Servers Upgrade',
      category: 'IT Infrastructure',
      quantity: 3,
      cost: 145000.00,
      reason: 'Replace aging server hardware to support higher load for ERP applications.',
      status: 'Pending Head Approval',
      managerDecision: 'Approved',
      managerComment: 'Critical replacement. Highly recommended.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'Technical feasibility checked. Budget is available in IT.',
      headDecision: 'Pending',
      headComment: '',
      fulfillmentTeam: 'IT Infrastructure Team',
      history: [
        { role: 'Employee', user: 'John Doe', action: 'Created Request', comment: 'Aging servers causing 5% drop in system availability.' },
        { role: 'Manager', user: 'Bob Johnson', action: 'Approved', comment: 'Critical replacement. Highly recommended.' },
        { role: 'Senior Manager', user: 'Charlie Brown', action: 'Approved', comment: 'Technical feasibility checked. Budget is available in IT.' }
      ]
    },
    {
      id: 2,
      requester: 'Jane Smith',
      departmentId: 2, // HR
      item: 'Ergonomic Office Chairs & Desks',
      category: 'Office Equipment',
      quantity: 50,
      cost: 22500.00,
      reason: 'Ergonomic seating for the new floor employees to prevent workplace fatigue.',
      status: 'Approved',
      managerDecision: 'Approved',
      managerComment: 'Reasonable cost, approved.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'HR budget has capacity.',
      headDecision: 'Approved',
      headComment: 'Approved. Good for employee health.',
      fulfillmentTeam: 'Facilities Management',
      history: [
        { role: 'Employee', user: 'Jane Smith', action: 'Created Request', comment: 'Standard request for onboarding.' },
        { role: 'Manager', user: 'Alice Williams', action: 'Approved', comment: 'Reasonable cost, approved.' },
        { role: 'Senior Manager', user: 'Alice Williams', action: 'Approved', comment: 'HR budget has capacity.' },
        { role: 'Head', user: 'Sarah Connor', action: 'Approved', comment: 'Approved. Good for employee health.' }
      ]
    },
    {
      id: 3,
      requester: 'John Doe',
      departmentId: 1, // IT
      item: 'CyberSecurity Vulnerability Testing tool license',
      category: 'Software Licenses',
      quantity: 1,
      cost: 48000.00,
      reason: 'Essential penetration testing and automated scanning tool for monthly security compliance audits.',
      status: 'Pending Head Approval',
      managerDecision: 'Approved',
      managerComment: 'Needed for SOC2 compliance.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'Compliance requirement. Must procure.',
      headDecision: 'Pending',
      headComment: '',
      fulfillmentTeam: 'InfoSec Operations',
      history: [
        { role: 'Employee', user: 'John Doe', action: 'Created Request', comment: 'Old license expiring soon.' },
        { role: 'Manager', user: 'Bob Johnson', action: 'Approved', comment: 'Needed for SOC2 compliance.' },
        { role: 'Senior Manager', user: 'Charlie Brown', action: 'Approved', comment: 'Compliance requirement. Must procure.' }
      ]
    },
    {
      id: 4,
      requester: 'Jane Smith',
      departmentId: 2, // HR
      item: 'Advanced Recruiting Platform subscription',
      category: 'Software Licenses',
      quantity: 1,
      cost: 15000.00,
      reason: 'AI-driven candidate sourcing platform to speed up hiring for tech roles.',
      status: 'Returned for Correction',
      managerDecision: 'Approved',
      managerComment: 'Speeds up hiring process.',
      seniorManagerDecision: 'Returned for Correction',
      seniorManagerComment: 'Please compare with LinkedIn Recruiter pricing first.',
      headDecision: 'Pending',
      headComment: '',
      fulfillmentTeam: 'HR Talent Acquisition',
      history: [
        { role: 'Employee', user: 'Jane Smith', action: 'Created Request', comment: 'Request for trial.' },
        { role: 'Manager', user: 'Alice Williams', action: 'Approved', comment: 'Speeds up hiring process.' },
        { role: 'Senior Manager', user: 'Alice Williams', action: 'Returned for Correction', comment: 'Please compare with LinkedIn Recruiter pricing first.' }
      ]
    },
    {
      id: 5,
      requester: 'John Doe',
      departmentId: 2, // HR (using Office Equipment budget)
      item: 'Office Supplies Restock',
      category: 'Office Equipment',
      quantity: 200,
      cost: 4500.00,
      reason: 'Monthly replenishment of printer ink, paper, files, and stationary items.',
      status: 'Approved',
      managerDecision: 'Approved',
      managerComment: 'Standard monthly refill.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'Approved.',
      headDecision: 'Approved',
      headComment: 'Approved standard spend.',
      fulfillmentTeam: 'Facilities Management',
      history: [
        { role: 'Employee', user: 'John Doe', action: 'Created Request', comment: 'Out of A4 papers.' },
        { role: 'Manager', user: 'Alice Williams', action: 'Approved', comment: 'Standard monthly refill.' },
        { role: 'Senior Manager', user: 'Alice Williams', action: 'Approved', comment: 'Approved.' },
        { role: 'Head', user: 'Sarah Connor', action: 'Approved', comment: 'Approved standard spend.' }
      ]
    },
    {
      id: 6,
      requester: 'Jane Smith',
      departmentId: 5, // Marketing
      item: 'Corporate Brand Video Production',
      category: 'Marketing Services',
      quantity: 1,
      cost: 65000.00,
      reason: 'Production of a 3-minute corporate video for the annual stakeholder meeting and website homepage.',
      status: 'Pending Senior Manager Approval',
      managerDecision: 'Approved',
      managerComment: 'Key branding event.',
      seniorManagerDecision: 'Pending',
      seniorManagerComment: '',
      headDecision: 'Pending',
      headComment: '',
      fulfillmentTeam: 'Brand Marketing',
      history: [
        { role: 'Employee', user: 'Jane Smith', action: 'Created Request', comment: 'Video pitch ready.' },
        { role: 'Manager', user: 'Alice Williams', action: 'Approved', comment: 'Key branding event.' }
      ]
    },
    {
      id: 7,
      requester: 'John Doe',
      departmentId: 1, // IT
      item: 'DevOps Consulting Services',
      category: 'Consulting & Advisory',
      quantity: 1,
      cost: 85000.00,
      reason: 'Specialized consulting contract to implement Kubernetes cluster and CI/CD pipelines.',
      status: 'Hold',
      managerDecision: 'Approved',
      managerComment: 'Important for product delivery.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'Forwarded to Head.',
      headDecision: 'Hold',
      headComment: 'On hold until next quarter review.',
      fulfillmentTeam: 'DevOps Platform Team',
      history: [
        { role: 'Employee', user: 'John Doe', action: 'Created Request', comment: 'Required for platform scaling.' },
        { role: 'Manager', user: 'Bob Johnson', action: 'Approved', comment: 'Important for product delivery.' },
        { role: 'Senior Manager', user: 'Charlie Brown', action: 'Approved', comment: 'Forwarded to Head.' },
        { role: 'Head', user: 'Sarah Connor', action: 'Hold', comment: 'On hold until next quarter review.' }
      ]
    },
    {
      id: 8,
      requester: 'John Doe',
      departmentId: 1, // IT
      item: 'Office Air Conditioning Repair',
      category: 'Maintenance',
      quantity: 4,
      cost: 18000.00,
      reason: 'Repairing faulty AC compressors in Block C before summer.',
      status: 'Pending Head Approval',
      managerDecision: 'Approved',
      managerComment: 'Urgent maintenance required.',
      seniorManagerDecision: 'Approved',
      seniorManagerComment: 'Approved.',
      headDecision: 'Pending',
      headComment: '',
      fulfillmentTeam: 'Facilities Management',
      history: [
        { role: 'Employee', user: 'John Doe', action: 'Created Request', comment: 'AC units making grinding noise.' },
        { role: 'Manager', user: 'Bob Johnson', action: 'Approved', comment: 'Urgent maintenance required.' },
        { role: 'Senior Manager', user: 'Charlie Brown', action: 'Approved', comment: 'Approved.' }
      ]
    }
  ],

  // Notifications
  notifications: [
    { id: 1, type: 'Budget Warning', message: 'Marketing Department budget utilization has reached 86.7% (Limit warning threshold: 80%).', unread: true, time: '2 hours ago' },
    { id: 2, type: 'High-Value Request', message: 'High-value purchase request: "Enterprise Rack Servers Upgrade" ($145,000.00) is awaiting Head approval.', unread: true, time: '3 hours ago' },
    { id: 3, type: 'Supplier Issue', message: 'Supplier status alert: "CyberDyne Systems" has been blacklisted due to vendor compliance breach.', unread: true, time: '1 day ago' },
    { id: 4, type: 'Compliance Alert', message: 'Supplier KYC Expiry: "OfficeDepot Inc" compliance certificate will expire on 2026-09-15.', unread: true, time: '2 days ago' },
    { id: 5, type: 'Unusual Spike', message: 'Unusual spending spike: IT infrastructure category spend is 45% higher than the quarterly rolling average.', unread: true, time: '3 days ago' }
  ],

  // Operational metrics
  activePOsCount: 5,
  newSuppliersMonth: 1
};

// Global chart references
let charts = {};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Setup Lucide Icons
  lucide.createIcons();
  
  // Calculate dynamic starting spends and budgets
  recalculateDashboardState();

  // Initialize Charts
  initCharts();

  // Render requests
  renderRequests();

  // Render notifications
  renderNotifications();

  // Render suppliers
  renderSuppliers();
});

// --- Core Calculation Logic ---
function recalculateDashboardState() {
  let totalAllocated = 0;
  let totalActual = 0;
  let totalCommitted = 0;

  state.departments.forEach(dept => {
    totalAllocated += dept.allocated;
    totalActual += dept.actual;
    totalCommitted += dept.committed;
  });

  const totalSpend = totalActual + totalCommitted;
  const availableBudget = totalAllocated - totalSpend;
  const utilizationPct = (totalSpend / totalAllocated) * 100;

  // Set values to DOM
  document.getElementById('kpi-total-spend').textContent = formatCurrency(totalSpend);
  document.getElementById('kpi-monthly-spend').textContent = formatCurrency(totalSpend / 12); // monthly average
  document.getElementById('kpi-annual-spend').textContent = formatCurrency(totalSpend);
  document.getElementById('kpi-budget-allocated').textContent = formatCurrency(totalAllocated);
  document.getElementById('kpi-actual-spend').textContent = formatCurrency(totalActual);
  document.getElementById('kpi-committed-spend').textContent = formatCurrency(totalCommitted);
  document.getElementById('kpi-available-budget').textContent = formatCurrency(availableBudget);
  
  document.getElementById('kpi-utilization-pct').textContent = `${utilizationPct.toFixed(1)}%`;
  document.getElementById('kpi-utilization-bar').style.width = `${utilizationPct}%`;

  // Set Color of Utilization Bar
  const utiBar = document.getElementById('kpi-utilization-bar');
  if (utilizationPct > 90) {
    utiBar.style.backgroundColor = 'var(--error)';
  } else if (utilizationPct > 80) {
    utiBar.style.backgroundColor = 'var(--warning)';
  } else {
    utiBar.style.backgroundColor = 'var(--success)';
  }

  // Active POs
  document.getElementById('kpi-active-pos').textContent = state.activePOsCount;
  
  // Suppliers counts
  const activeSupp = state.suppliers.filter(s => s.status === 'Active').length;
  document.getElementById('kpi-total-suppliers').textContent = activeSupp;
  document.getElementById('kpi-new-suppliers').textContent = state.newSuppliersMonth;

  // Supplier list summary numbers
  const suspCount = state.suppliers.filter(s => s.status === 'Suspended').length;
  const blackCount = state.suppliers.filter(s => s.status === 'Blacklisted').length;
  
  if (document.getElementById('supp-active-cnt')) document.getElementById('supp-active-cnt').textContent = activeSupp;
  if (document.getElementById('supp-suspended-cnt')) document.getElementById('supp-suspended-cnt').textContent = suspCount;
  if (document.getElementById('supp-blacklisted-cnt')) document.getElementById('supp-blacklisted-cnt').textContent = blackCount;

  // Badges next to navigation
  const pendingCount = state.requests.filter(r => r.status === 'Pending Head Approval').length;
  document.getElementById('requests-badge-count').textContent = pendingCount;
  if (pendingCount === 0) {
    document.getElementById('requests-badge-count').style.display = 'none';
  } else {
    document.getElementById('requests-badge-count').style.display = 'inline-flex';
  }
}

// --- Tab Navigation ---
function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Toggle views
  document.getElementById('panel-dashboard').style.display = tabId === 'dashboard' ? 'block' : 'none';
  document.getElementById('panel-requests').style.display = tabId === 'requests' ? 'block' : 'none';
  document.getElementById('panel-suppliers').style.display = tabId === 'suppliers' ? 'block' : 'none';

  // Toggle active buttons
  document.getElementById('btn-dashboard').classList.toggle('active', tabId === 'dashboard');
  document.getElementById('btn-requests').classList.toggle('active', tabId === 'requests');
  document.getElementById('btn-suppliers').classList.toggle('active', tabId === 'suppliers');

  // Change navbar headers
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  if (tabId === 'dashboard') {
    pageTitle.textContent = 'Executive Dashboard';
    pageSubtitle.textContent = 'Real-time procurement metrics and spend analytics.';
    // Force chart re-draw/updates
    updateChartsData();
  } else if (tabId === 'requests') {
    pageTitle.textContent = 'Review Procurement Requests';
    pageSubtitle.textContent = 'Action employee requests requiring executive sign-off.';
    renderRequests();
  } else if (tabId === 'suppliers') {
    pageTitle.textContent = 'Suppliers Directory';
    pageSubtitle.textContent = 'View vendor compliance, vetting, and performance ratings.';
    renderSuppliers();
  }
}

// --- Theme Management ---
function toggleTheme() {
  const html = document.querySelector('html');
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  state.theme = newTheme;

  // Toggle sun/moon icons
  document.getElementById('theme-icon-sun').style.display = newTheme === 'light' ? 'none' : 'block';
  document.getElementById('theme-icon-moon').style.display = newTheme === 'light' ? 'block' : 'none';

  // Re-initialize charts with the new theme colors
  destroyCharts();
  initCharts();
}

// --- Notifications drawer ---
function toggleNotifications() {
  const drawer = document.getElementById('notifications-drawer');
  drawer.classList.toggle('active');
}

function renderNotifications() {
  const container = document.getElementById('notifications-list');
  container.innerHTML = '';

  const unreadCount = state.notifications.filter(n => n.unread).length;
  const indicator = document.getElementById('notif-indicator');
  if (unreadCount > 0) {
    indicator.style.display = 'block';
  } else {
    indicator.style.display = 'none';
  }

  if (state.notifications.length === 0) {
    container.innerHTML = `<div class="text-secondary text-center" style="padding: 2rem 0;">No active alerts.</div>`;
    return;
  }

  state.notifications.forEach(notif => {
    let cardClass = 'notif-card';
    if (notif.unread) cardClass += ' unread';
    
    // Choose icon and class type
    let typeClass = '';
    switch(notif.type) {
      case 'Budget Warning': typeClass = 'notif-budget'; break;
      case 'High-Value Request': typeClass = 'notif-value'; break;
      case 'Supplier Issue': typeClass = 'notif-supplier'; break;
      case 'Compliance Alert': typeClass = 'notif-compliance'; break;
      case 'Unusual Spike': typeClass = 'notif-spike'; break;
    }

    const card = document.createElement('div');
    card.className = `${cardClass} ${typeClass}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h5>${notif.type}</h5>
        ${notif.unread ? `<button class="btn btn-secondary btn-sm" style="padding: 0.15rem 0.4rem; font-size: 0.7rem;" onclick="markAsRead(${notif.id}, event)">Mark Read</button>` : ''}
      </div>
      <p>${notif.message}</p>
      <span class="notif-time">${notif.time}</span>
    `;
    container.appendChild(card);
  });
}

function markAsRead(id, event) {
  if (event) event.stopPropagation();
  const notif = state.notifications.find(n => n.id === id);
  if (notif) {
    notif.unread = false;
    renderNotifications();
    recalculateDashboardState();
  }
}

function markAllNotificationsRead() {
  state.notifications.forEach(n => n.unread = false);
  renderNotifications();
  recalculateDashboardState();
}

function addNotification(type, message) {
  const id = state.notifications.length + 1;
  state.notifications.unshift({
    id,
    type,
    message,
    unread: true,
    time: 'Just now'
  });
  renderNotifications();
  
  // Show visual cue on bell icon
  const bell = document.getElementById('bell-btn');
  bell.classList.add('pulse-effect');
  setTimeout(() => bell.classList.remove('pulse-effect'), 2000);
}

// --- Render Requests ---
function renderRequests() {
  const container = document.getElementById('requests-list-container');
  container.innerHTML = '';

  const filterCategory = document.getElementById('filter-category').value;
  const filterStatus = document.getElementById('filter-status').value;
  const searchQuery = document.getElementById('search-requests').value.toLowerCase();

  // Filter requests
  const filtered = state.requests.filter(req => {
    const categoryMatch = filterCategory === 'all' || req.category === filterCategory;
    const statusMatch = filterStatus === 'all' || req.status === filterStatus;
    const searchMatch = req.item.toLowerCase().includes(searchQuery) ||
                        req.reason.toLowerCase().includes(searchQuery) ||
                        req.requester.toLowerCase().includes(searchQuery) ||
                        req.category.toLowerCase().includes(searchQuery);
    return categoryMatch && statusMatch && searchMatch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="glass text-center" style="padding: 4rem 2rem; border-radius: var(--radius-lg);">
        <i data-lucide="inbox" style="width:48px; height:48px; color:var(--text-muted); margin-bottom:1rem;"></i>
        <h3>No matching requests found</h3>
        <p class="text-secondary" style="margin-top:0.5rem;">Try adjusting your search criteria or status filter.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  filtered.forEach(req => {
    const dept = state.departments.find(d => d.id === req.departmentId);
    const deptName = dept ? dept.name : 'Unknown';
    const deptAllocated = dept ? dept.allocated : 0;
    const deptSpent = dept ? (dept.actual + dept.committed) : 0;
    const deptUtilization = deptAllocated > 0 ? ((deptSpent / deptAllocated) * 100).toFixed(1) : 0;

    // Build timeline approval history
    let timelineHTML = '';
    req.history.forEach(step => {
      let markerClass = 'step-done';
      if (step.action.includes('Reject') || step.action.includes('Denied')) markerClass = 'step-err';
      else if (step.action.includes('Return') || step.action.includes('Correction')) markerClass = 'step-warn';
      else if (step.action.includes('Created')) markerClass = 'step-done';

      timelineHTML += `
        <div class="timeline-step">
          <div class="timeline-marker ${markerClass}"></div>
          <div class="timeline-info">
            <h6>${step.role}: ${step.user} <span class="badge ${getBadgeClass(step.action)}">${step.action}</span></h6>
            ${step.comment ? `<p class="timeline-comment">"${step.comment}"</p>` : ''}
          </div>
        </div>
      `;
    });

    const isPending = req.status === 'Pending Head Approval';

    const card = document.createElement('div');
    card.className = 'request-card glass';
    card.innerHTML = `
      <div class="request-card-header">
        <div class="req-title-section">
          <h3>${req.item}</h3>
          <div class="req-meta">
            <span><i data-lucide="user"></i> Requester: ${req.requester}</span>
            <span><i data-lucide="building"></i> Dept: ${deptName}</span>
            <span><i data-lucide="tag"></i> Category: ${req.category}</span>
          </div>
        </div>
        <span class="badge ${getBadgeClass(req.status)}">${req.status}</span>
      </div>

      <div class="request-card-body">
        <div class="req-details-left">
          <div class="detail-block">
            <h5>Business Justification & Reason</h5>
            <p>${req.reason}</p>
          </div>
          
          <div class="detail-block">
            <h5>Complete Approval History</h5>
            <div class="approvals-timeline">
              ${timelineHTML}
            </div>
          </div>
        </div>

        <div class="req-details-right" style="display:flex; flex-direction:column; gap:1.25rem;">
          <div class="budget-info-card">
            <h4>
              <span>Company Budget Status</span>
              <span class="badge badge-info">${deptName.split(' ')[0]}</span>
            </h4>
            <div class="budget-grid-info">
              <div>
                <span>Allocated Budget</span>
                <strong>${formatCurrency(deptAllocated)}</strong>
              </div>
              <div>
                <span>Used + Committed</span>
                <strong>${formatCurrency(deptSpent)}</strong>
              </div>
              <div>
                <span>Available Budget</span>
                <strong style="color: ${deptAllocated - deptSpent > 0 ? 'var(--success)' : 'var(--error)'}">
                  ${formatCurrency(deptAllocated - deptSpent)}
                </strong>
              </div>
              <div>
                <span>Utilization Rate</span>
                <strong style="color: ${deptUtilization > 85 ? 'var(--error)' : deptUtilization > 70 ? 'var(--warning)' : 'var(--success)'}">
                  ${deptUtilization}%
                </strong>
              </div>
            </div>
          </div>

          <div class="detail-block">
            <h5>Fulfillment Information</h5>
            <p><strong>Fulfillment Team:</strong> ${req.fulfillmentTeam}</p>
            <p><strong>Quantity Requested:</strong> ${req.quantity} units</p>
          </div>
        </div>
      </div>

      <div class="request-card-footer">
        <div class="cost-section">
          <span>Estimated Total Cost</span>
          <h4>${formatCurrency(req.cost)}</h4>
        </div>
        
        ${isPending ? `
          <div class="action-buttons">
            <button class="btn btn-success" onclick="openActionModal(${req.id}, 'Approve')">
              <i data-lucide="check-circle-2"></i> Approve
            </button>
            <button class="btn btn-error" onclick="openActionModal(${req.id}, 'Reject')">
              <i data-lucide="x-circle"></i> Reject
            </button>
            <button class="btn btn-warning" onclick="openActionModal(${req.id}, 'Return for Correction')">
              <i data-lucide="undo-2"></i> Return for Correction
            </button>
            <button class="btn btn-secondary" onclick="openActionModal(${req.id}, 'Hold')">
              <i data-lucide="pause-circle"></i> Hold
            </button>
          </div>
        ` : `
          <div class="action-status-text">
            <span style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">
              Actioned: <strong>${req.status}</strong> with Head Comment: "${req.headComment || 'None'}"
            </span>
          </div>
        `}
      </div>
    `;
    container.appendChild(card);
  });
  
  lucide.createIcons();
}

function getBadgeClass(status) {
  if (status.includes('Pending Head')) return 'badge-primary';
  if (status.includes('Pending Manager')) return 'badge-info';
  if (status.includes('Pending Senior')) return 'badge-info';
  if (status === 'Approved' || status === 'Created Request') return 'badge-success';
  if (status === 'Rejected' || status.includes('Denied')) return 'badge-error';
  if (status === 'Hold') return 'badge-warning';
  if (status.includes('Return')) return 'badge-warning';
  return 'badge-secondary';
}

function filterRequests() {
  renderRequests();
}

// --- Action Modals ---
function openActionModal(reqId, actionType) {
  const req = state.requests.find(r => r.id === reqId);
  if (!req) return;

  state.selectedRequestId = reqId;
  state.selectedAction = actionType;

  document.getElementById('modal-title').textContent = `Executive Action: ${actionType}`;
  document.getElementById('modal-item-name').textContent = req.item;
  document.getElementById('modal-item-cost').textContent = formatCurrency(req.cost);
  
  const dept = state.departments.find(d => d.id === req.departmentId);
  document.getElementById('modal-item-dept').textContent = dept ? dept.name : 'Unknown';

  const submitBtn = document.getElementById('btn-submit-action');
  
  // Style submit button color to match action
  submitBtn.className = 'btn';
  if (actionType === 'Approve') submitBtn.classList.add('btn-success');
  else if (actionType === 'Reject') submitBtn.classList.add('btn-error');
  else if (actionType === 'Return for Correction') submitBtn.classList.add('btn-warning');
  else submitBtn.classList.add('btn-secondary');

  document.getElementById('action-comment').value = '';
  document.getElementById('action-modal').classList.add('active');
}

function closeModal() {
  document.getElementById('action-modal').classList.remove('active');
  state.selectedRequestId = null;
  state.selectedAction = null;
}

function submitExecutiveAction() {
  const reqId = state.selectedRequestId;
  const action = state.selectedAction;
  const comment = document.getElementById('action-comment').value.trim();

  if (!reqId || !action) return;

  const req = state.requests.find(r => r.id === reqId);
  if (req) {
    req.status = action === 'Approve' ? 'Approved' : action;
    req.headDecision = action;
    req.headComment = comment || `${action} without additional comments.`;
    
    // Add to timeline history
    req.history.push({
      role: 'Head',
      user: 'Sarah Connor',
      action: action,
      comment: req.headComment
    });

    // --- Automatic Spend/Budget Updates ---
    if (action === 'Approve') {
      const dept = state.departments.find(d => d.id === req.departmentId);
      if (dept) {
        // Approving requests adds it to "Committed Spend"
        dept.committed += req.cost;
        state.activePOsCount += 1; // Creates a Purchase Order
        
        // Log notification
        addNotification('High-Value Request', `Executive Head approved Purchase Order request for "${req.item}" ($${req.cost.toLocaleString()}) for the ${dept.name}.`);
        
        // Budget Warn Check
        const totalSpent = dept.actual + dept.committed;
        const utilPct = (totalSpent / dept.allocated) * 100;
        if (utilPct >= 95) {
          addNotification('Budget Warning', `CRITICAL LIMIT EXCEEDED: ${dept.name} budget utilization is at ${utilPct.toFixed(1)}% (Allocated: $${dept.allocated.toLocaleString()}).`);
        } else if (utilPct >= 80) {
          addNotification('Budget Warning', `BUDGET WARNING: ${dept.name} budget utilization is at ${utilPct.toFixed(1)}% (Allocated: $${dept.allocated.toLocaleString()}).`);
        }
      }
    } else {
      addNotification('Supplier Issue' /* Or general audit */, `Executive Head action: [${action}] on request "${req.item}" ($${req.cost.toLocaleString()}). Comments: "${req.headComment}"`);
    }

    // Refresh display
    closeModal();
    recalculateDashboardState();
    renderRequests();
    
    // Switch to request list visual confirmations
    setTimeout(() => {
      alert(`Request has been successfully actioned: ${action}`);
    }, 100);
  }
}

// --- Render Suppliers ---
function renderSuppliers() {
  const container = document.getElementById('suppliers-grid-container');
  container.innerHTML = '';

  state.suppliers.forEach(supp => {
    let statusClass = 'badge-success';
    if (supp.status === 'Suspended') statusClass = 'badge-warning';
    if (supp.status === 'Blacklisted') statusClass = 'badge-error';

    // Build rating stars
    let ratingStars = '';
    const roundedRating = Math.round(supp.rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        ratingStars += `<i data-lucide="star" style="fill:var(--warning); color:var(--warning); width:14px; height:14px;"></i>`;
      } else {
        ratingStars += `<i data-lucide="star" style="color:var(--text-muted); width:14px; height:14px;"></i>`;
      }
    }

    const isKycExpired = new Date(supp.kycExpiry) < new Date();

    const card = document.createElement('div');
    card.className = 'supplier-card glass';
    card.innerHTML = `
      <div class="supplier-header">
        <div class="supplier-info-block">
          <h4>${supp.name}</h4>
          <div class="supplier-rating">
            ${ratingStars}
            <span>(${supp.rating.toFixed(1)})</span>
          </div>
        </div>
        <span class="badge ${statusClass}">${supp.status}</span>
      </div>

      <div class="supplier-details-list">
        <div>
          <span>Email:</span>
          <strong>${supp.email}</strong>
        </div>
        <div>
          <span>Phone:</span>
          <strong>${supp.phone}</strong>
        </div>
        <div>
          <span>KYC Compliance:</span>
          <strong style="color: ${isKycExpired ? 'var(--error)' : 'var(--success)'}">
            ${supp.kycExpiry} ${isKycExpired ? '(Expired!)' : ''}
          </strong>
        </div>
        <div>
          <span>Address:</span>
          <strong style="text-align:right; font-size:0.75rem; max-width:180px;">${supp.address}</strong>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

// --- Chart.js Data Visualizations ---
function initCharts() {
  const isDark = state.theme === 'dark';
  
  // Theme Color Configurations
  const textPrimary = isDark ? '#f8fafc' : '#0f172a';
  const textSecondary = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#1e293b' : '#e2e8f0';

  Chart.defaults.color = textSecondary;
  Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";

  // 1. Department Spend Chart
  const ctxDept = document.getElementById('chart-department-spend').getContext('2d');
  charts.dept = new Chart(ctxDept, {
    type: 'bar',
    data: getDeptChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { color: textPrimary } }
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textSecondary } },
        y: { grid: { color: gridColor }, ticks: { color: textSecondary } }
      }
    }
  });

  // 2. Category Spend Chart
  const ctxCat = document.getElementById('chart-category-spend').getContext('2d');
  charts.cat = new Chart(ctxCat, {
    type: 'doughnut',
    data: getCategoryChartData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: textPrimary } }
      },
      cutout: '65%'
    }
  });

  // 3. Monthly Spend Trend Chart
  const ctxTrend = document.getElementById('chart-monthly-trend').getContext('2d');
  charts.trend = new Chart(ctxTrend, {
    type: 'line',
    data: {
      labels: ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026 (Current)'],
      datasets: [{
        label: 'Monthly Expenditure ($)',
        data: [78000, 92000, 115000, 104000, 135000, 125000, 110000],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: gridColor } },
        y: { grid: { color: gridColor } }
      }
    }
  });

  // 4. High-Value Trend Chart (Combo Chart)
  const ctxHighVal = document.getElementById('chart-high-value-trend').getContext('2d');
  charts.highval = new Chart(ctxHighVal, {
    type: 'bar',
    data: {
      labels: ['IT Server replacement', 'Kubernetes consulting', 'Marketing Brand Video', 'Office desks', 'AC Maintenance'],
      datasets: [
        {
          label: 'Estimated Cost ($)',
          type: 'bar',
          data: [145000, 85000, 65000, 22500, 18000],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'Budget Limit Safety Line ($)',
          type: 'line',
          data: [150000, 100000, 75000, 50000, 25000],
          borderColor: '#ef4444',
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' }
      },
      scales: {
        x: { grid: { color: gridColor } },
        y: { grid: { color: gridColor } }
      }
    }
  });

  // 5. Top Suppliers Chart
  const ctxSupp = document.getElementById('chart-top-suppliers').getContext('2d');
  charts.supp = new Chart(ctxSupp, {
    type: 'bar',
    data: {
      labels: ['TechCorp Solutions', 'OfficeDepot Inc', 'Apex Logistics', 'Global Consulting', 'CyberDyne Systems'],
      datasets: [{
        label: 'Total Spend Volume ($)',
        data: [250000, 88000, 45000, 18000, 4500],
        backgroundColor: '#10b981',
        borderRadius: 8
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: gridColor } },
        y: { grid: { color: gridColor } }
      }
    }
  });

  // 6. Supplier Performance Chart (Polar Area)
  const ctxPerf = document.getElementById('chart-supplier-performance').getContext('2d');
  charts.perf = new Chart(ctxPerf, {
    type: 'polarArea',
    data: {
      labels: ['Vetting Status', 'Quality Control', 'Fulfillment Speed', 'KYC Compliance', 'Billing Transparency'],
      datasets: [{
        label: 'Vendor Vetting Scores (Max 10)',
        data: [9.2, 8.5, 8.0, 9.5, 8.8],
        backgroundColor: [
          'rgba(139, 92, 246, 0.4)',
          'rgba(59, 130, 246, 0.4)',
          'rgba(16, 185, 129, 0.4)',
          'rgba(245, 158, 11, 0.4)',
          'rgba(14, 165, 233, 0.4)'
        ],
        borderColor: isDark ? '#1e293b' : '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right', labels: { color: textPrimary } }
      },
      scales: {
        r: {
          grid: { color: gridColor },
          angleLines: { color: gridColor },
          ticks: { color: textSecondary, backdropColor: 'transparent' }
        }
      }
    }
  });
}

function destroyCharts() {
  Object.keys(charts).forEach(key => {
    if (charts[key]) {
      charts[key].destroy();
    }
  });
  charts = {};
}

function updateChartsData() {
  if (charts.dept) {
    charts.dept.data = getDeptChartData();
    charts.dept.update();
  }
  if (charts.cat) {
    charts.cat.data = getCategoryChartData();
    charts.cat.update();
  }
}

function getDeptChartData() {
  const deptLabels = state.departments.map(d => d.name.replace(' Department', ''));
  const deptAllocated = state.departments.map(d => d.allocated);
  const deptSpent = state.departments.map(d => d.actual + d.committed);

  return {
    labels: deptLabels,
    datasets: [
      {
        label: 'Allocated Budget ($)',
        data: deptAllocated,
        backgroundColor: '#6366f1',
        borderRadius: 4
      },
      {
        label: 'Used + Committed Spend ($)',
        data: deptSpent,
        backgroundColor: '#10b981',
        borderRadius: 4
      }
    ]
  };
}

function getCategoryChartData() {
  const catSummary = {};
  
  // Calculate category aggregates from approved requests
  state.requests.forEach(r => {
    const isApproved = r.status === 'Approved';
    if (isApproved) {
      if (!catSummary[r.category]) catSummary[r.category] = 0;
      catSummary[r.category] += r.cost;
    }
  });

  // Make sure we have standard categories represented
  const standardCats = ['IT Infrastructure', 'Office Equipment', 'Software Licenses', 'Marketing Services', 'Maintenance'];
  standardCats.forEach(c => {
    if (!catSummary[c]) catSummary[c] = 0;
  });

  // Include starting default spends
  catSummary['IT Infrastructure'] += 320000;
  catSummary['Office Equipment'] += 80000;
  catSummary['Software Licenses'] += 120000;
  catSummary['Marketing Services'] += 190000;
  catSummary['Maintenance'] += 100000;

  return {
    labels: Object.keys(catSummary),
    datasets: [{
      data: Object.values(catSummary),
      backgroundColor: [
        '#8b5cf6', // IT infra
        '#eab308', // Office equip
        '#3b82f6', // Software
        '#ec4899', // Marketing
        '#14b8a6'  // Maintenance
      ],
      borderWidth: 0
    }]
  };
}

// --- Helper Formatting Utilities ---
function formatCurrency(val) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(val);
}
