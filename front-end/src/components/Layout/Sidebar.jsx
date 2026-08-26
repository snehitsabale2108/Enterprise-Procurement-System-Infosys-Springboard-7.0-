import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, CheckSquare, ShoppingCart, Users, Building2,
  CreditCard, Settings, ClipboardList, Package, Monitor, Code, Wrench,
  Shield, Bell, History, Truck, FolderKanban, ChevronLeft, ChevronRight, Cpu
} from 'lucide-react';
import { useState } from 'react';
import './Layout.css';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const getNavItems = () => {
    const role = currentUser?.role;
    const items = [];

    // Dashboard — everyone
    items.push({ to: '/dashboard', icon: LayoutDashboard, label: role === 'supplier' ? 'Supplier Portal' : 'Dashboard' });

    // Supplier portal specific navigation
    if (role === 'supplier') {
      items.push({ to: '/supplier-portal', icon: Building2, label: 'Portal Workspace' });
      return items;
    }

    // Employee: Requests
    if (['employee', 'manager', 'senior_manager', 'head', 'admin'].includes(role)) {
      items.push({ to: '/requests', icon: FileText, label: 'Requests' });
    }

    // Approvals: Manager, Sr Manager, Head
    if (['manager', 'senior_manager', 'head'].includes(role)) {
      items.push({ to: '/approvals', icon: CheckSquare, label: 'Approvals' });
    }

    // Procurement
    if (['procurement_officer', 'equipment_team', 'software_team', 'facilities_team', 'admin'].includes(role)) {
      items.push({ to: '/procurement', icon: ShoppingCart, label: 'Procurement' });
    }

    // Equipment Team
    if (['equipment_team', 'procurement_officer', 'admin'].includes(role)) {
      items.push({ to: '/procurement/equipment', icon: Monitor, label: 'Equipment' });
    }

    // Software Team
    if (['software_team', 'procurement_officer', 'admin'].includes(role)) {
      items.push({ to: '/procurement/software', icon: Code, label: 'Software' });
    }

    // Facilities Team
    if (['facilities_team', 'procurement_officer', 'admin'].includes(role)) {
      items.push({ to: '/procurement/facilities', icon: Wrench, label: 'Facilities' });
    }

    // Suppliers
    if (['procurement_officer', 'equipment_team', 'software_team', 'facilities_team', 'admin'].includes(role)) {
      items.push({ to: '/suppliers', icon: Building2, label: 'Suppliers' });
    }

    // Purchase Orders
    if (['procurement_officer', 'equipment_team', 'software_team', 'facilities_team', 'finance_officer', 'admin'].includes(role)) {
      items.push({ to: '/purchase-orders', icon: FolderKanban, label: 'Purchase Orders' });
    }

    // GRN
    if (['equipment_team', 'facilities_team', 'procurement_officer', 'admin'].includes(role)) {
      items.push({ to: '/grn', icon: Package, label: 'Goods Receipt' });
    }

    // Finance
    if (['finance_officer', 'head', 'admin'].includes(role)) {
      items.push({ to: '/finance/quotations', icon: ClipboardList, label: 'Quotation Approvals' });
      items.push({ to: '/finance/purchase-orders', icon: CheckSquare, label: 'PO Approvals' });
      items.push({ to: '/finance', icon: CreditCard, label: 'Finance' });
    }

    // Admin section
    if (role === 'admin') {
      items.push({ type: 'divider', label: 'Administration' });
      items.push({ to: '/admin/users', icon: Users, label: 'Users' });
      items.push({ to: '/admin/roles', icon: Shield, label: 'Roles' });
      items.push({ to: '/admin/departments', icon: Building2, label: 'Departments' });
      items.push({ to: '/admin/categories', icon: FolderKanban, label: 'Categories' });
      items.push({ to: '/admin/approval-rules', icon: ClipboardList, label: 'Approval Rules' });
      items.push({ to: '/admin/audit-logs', icon: History, label: 'Audit Logs' });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Cpu size={24} />
          {!collapsed && <span>EPS</span>}
        </div>
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if (item.type === 'divider') {
            return (
              <div key={i} className="sidebar-divider">
                {!collapsed && <span>{item.label}</span>}
              </div>
            );
          }

          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive || location.pathname.startsWith(item.to + '/') ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user-mini">
            <div className="avatar avatar-sm" style={{ background: currentUser?.avatar }}>
              {currentUser?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="sidebar-user-mini-info">
              <span className="sidebar-user-mini-name">{currentUser?.name}</span>
              <span className="sidebar-user-mini-role">{currentUser?.role?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
