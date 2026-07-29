import { roles, users } from '../../data/mockData';
import { Shield, Users } from 'lucide-react';

const permissionLabels = {
  create_request: 'Create Request', view_own_requests: 'View Own Requests', edit_draft: 'Edit Draft',
  cancel_request: 'Cancel Request', view_team_requests: 'View Team Requests', approve_request: 'Approve',
  reject_request: 'Reject', return_request: 'Return', view_dept_requests: 'View Dept Requests',
  escalate_request: 'Escalate', view_budget: 'View Budget', view_all_requests: 'View All Requests',
  view_analytics: 'View Analytics', manage_procurement: 'Manage Procurement', create_po: 'Create PO',
  manage_suppliers: 'Manage Suppliers', compare_quotations: 'Compare Quotations', manage_equipment: 'Manage Equipment',
  verify_delivery: 'Verify Delivery', create_grn: 'Create GRN', handover: 'Handover',
  manage_software: 'Manage Software', check_licenses: 'Check Licenses', assign_license: 'Assign License',
  purchase_software: 'Purchase Software', manage_facilities: 'Manage Facilities', coordinate_vendors: 'Coordinate Vendors',
  verify_invoice: 'Verify Invoice', process_payment: 'Process Payment', view_payments: 'View Payments',
  manage_users: 'Manage Users', manage_roles: 'Manage Roles', manage_departments: 'Manage Departments',
  manage_categories: 'Manage Categories', manage_rules: 'Manage Rules', view_audit: 'View Audit',
};

const roleColors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#3b82f6'];

const RoleManagement = () => {
  const getUserCount = (roleName) => users.filter(u => u.role === roleName).length;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Role Management</h1>
        <p>System roles and their permissions</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--space-md)' }}>
        {roles.map((role, i) => {
          const color = roleColors[i % roleColors.length];
          const count = getUserCount(role.name);
          return (
            <div key={role.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={20} color={color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>{role.displayName}</h3>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{role.name}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                  <Users size={12} /> {count} user{count !== 1 ? 's' : ''}
                </div>
              </div>

              <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-sm)' }}>
                Permissions ({role.permissions.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {role.permissions.map(p => (
                  <span key={p} className="badge badge-primary" style={{ fontSize: '0.68rem', textTransform: 'none', letterSpacing: 0 }}>
                    {permissionLabels[p] || p.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleManagement;
