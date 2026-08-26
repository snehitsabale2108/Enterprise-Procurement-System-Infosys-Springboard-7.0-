import { apiCall, isMockMode } from './apiConfig';
import { requests, suppliers, purchaseOrders, payments, users, departments, chartData, notifications as mockNotifications, auditLogs, softwareLicenses, goodsReceiptNotes, categories, roles, quotations, approvalRules } from '../data/mockData';

// ============================================
// Dashboard Service
// ============================================

/**
 * GET /dashboard/employee?userId=string
 * 
 * Response (200):
 * {
 *   "stats": { "total": n, "pending": n, "approved": n, "rejected": n, "inProgress": n },
 *   "recentRequests": [...],
 *   "monthlyRequests": [{ "month": "string", "requests": n }],
 *   "categoryDistribution": [{ "name": "string", "value": n }]
 * }
 */
export const getEmployeeDashboard = async (userId) => {
  // return apiCall(`/dashboard/employee?userId=${userId}`);
  if (isMockMode()) {
    const userRequests = requests.filter(r => r.createdBy === userId);
    return {
      stats: {
        total: userRequests.length,
        pending: userRequests.filter(r => r.status.startsWith('pending')).length,
        approved: userRequests.filter(r => r.status === 'approved' || r.status === 'in_procurement' || r.status === 'delivered' || r.status === 'closed').length,
        rejected: userRequests.filter(r => r.status === 'rejected').length,
        inProgress: userRequests.filter(r => r.status === 'in_procurement').length,
      },
      recentRequests: userRequests.slice(0, 5),
      monthlyRequests: chartData.monthlyRequests,
      categoryDistribution: chartData.categoryDistribution,
    };
  }
};

/**
 * GET /dashboard/manager?department=string
 * 
 * Response (200):
 * {
 *   "stats": { "pendingApprovals": n, "approvedThisMonth": n, "rejectedThisMonth": n, "totalSpending": n },
 *   "pendingRequests": [...],
 *   "approvalMetrics": [{ "month": "string", "avgDays": n, "approvalRate": n }],
 *   "departmentSpending": [...]
 * }
 */
export const getManagerDashboard = async (department) => {
  // return apiCall(`/dashboard/manager?department=${department}`);
  if (isMockMode()) {
    const pending = requests.filter(r => r.status === 'pending_manager');
    return {
      stats: {
        pendingApprovals: pending.length,
        approvedThisMonth: 8,
        rejectedThisMonth: 2,
        totalSpending: 1250000,
      },
      pendingRequests: pending,
      approvalMetrics: chartData.approvalMetrics,
      departmentSpending: chartData.departmentSpending,
    };
  }
};

/**
 * GET /dashboard/senior-manager
 */
export const getSeniorManagerDashboard = async () => {
  // return apiCall('/dashboard/senior-manager');
  if (isMockMode()) {
    const pending = requests.filter(r => r.status === 'pending_senior_manager');
    return {
      stats: {
        pendingApprovals: pending.length,
        approvedThisMonth: 12,
        escalatedRequests: 3,
        budgetUtilization: 68,
      },
      pendingRequests: pending,
      departmentSpending: chartData.departmentSpending,
      monthlySpending: chartData.monthlySpending,
    };
  }
};

/**
 * GET /dashboard/head
 * 
 * Response (200):
 * {
 *   "stats": {
 *     "totalProcurementSpend": n, "monthlySpend": n, "annualSpend": n,
 *     "budgetAllocated": n, "budgetUsed": n, "budgetRemaining": n,
 *     "budgetUtilization": n, "activePOs": n, "activeSuppliers": n
 *   },
 *   "categorySpending": [...], "departmentSpending": [...],
 *   "monthlyTrends": [...], "supplierPerformance": [...]
 * }
 */
export const getHeadDashboard = async () => {
  // return apiCall('/dashboard/head');
  if (isMockMode()) {
    const totalBudget = departments.reduce((s, d) => s + d.budget, 0);
    const totalUsed = departments.reduce((s, d) => s + d.budgetUsed, 0);
    return {
      stats: {
        totalProcurementSpend: totalUsed,
        monthlySpend: 2100000,
        annualSpend: totalUsed,
        budgetAllocated: totalBudget,
        budgetUsed: totalUsed,
        budgetRemaining: totalBudget - totalUsed,
        budgetUtilization: Math.round((totalUsed / totalBudget) * 100),
        activePOs: purchaseOrders.filter(po => po.status !== 'closed').length,
        activeSuppliers: suppliers.filter(s => s.status === 'active').length,
      },
      categorySpending: chartData.categoryDistribution,
      departmentSpending: chartData.departmentSpending,
      monthlyTrends: chartData.monthlySpending,
      supplierPerformance: chartData.supplierPerformance,
    };
  }
};

/**
 * GET /dashboard/procurement
 */
export const getProcurementDashboard = async () => {
  // return apiCall('/dashboard/procurement');
  if (isMockMode()) {
    return {
      stats: {
        approvedRequests: requests.filter(r => r.status === 'approved' || r.status === 'in_procurement').length,
        pendingPOs: purchaseOrders.filter(po => po.status === 'draft' || po.status === 'sent').length,
        activePOs: purchaseOrders.filter(po => po.status === 'accepted').length,
        completedOrders: purchaseOrders.filter(po => po.status === 'closed').length,
      },
      approvedRequests: requests.filter(r => r.status === 'approved' || r.status === 'in_procurement'),
      supplierPerformance: chartData.supplierPerformance,
      monthlyOrders: chartData.monthlyRequests,
    };
  }
};

/**
 * GET /dashboard/finance
 */
export const getFinanceDashboard = async () => {
  // return apiCall('/dashboard/finance');
  if (isMockMode()) {
    return {
      stats: {
        pendingInvoices: payments.filter(p => p.status === 'pending').length,
        pendingPayments: payments.filter(p => p.status === 'processing' || p.status === 'approved').length,
        paidInvoices: payments.filter(p => p.status === 'paid').length,
        totalSpending: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
      },
      payments: payments,
      paymentTrend: chartData.paymentTrend,
    };
  }
};

/**
 * GET /dashboard/admin
 */
export const getAdminDashboard = async () => {
  // return apiCall('/dashboard/admin');
  if (isMockMode()) {
    return {
      stats: {
        totalUsers: users.length,
        totalRoles: roles.length,
        totalDepartments: departments.length,
        totalCategories: categories.length,
        totalSuppliers: suppliers.length,
        totalAuditLogs: auditLogs.length,
      },
    };
  }
};
