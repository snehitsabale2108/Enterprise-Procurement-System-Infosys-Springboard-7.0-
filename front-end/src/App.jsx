import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import DashboardRouter from './pages/dashboards/DashboardRouter';
import RequestList from './pages/requests/RequestList';
import CreateRequest from './pages/requests/CreateRequest';
import RequestDetail from './pages/requests/RequestDetail';
import ApprovalQueue from './pages/approvals/ApprovalQueue';
import ProcurementQueue from './pages/procurement/ProcurementQueue';
import EquipmentWorkflow from './pages/procurement/EquipmentWorkflow';
import SoftwareWorkflow from './pages/procurement/SoftwareWorkflow';
import FacilitiesWorkflow from './pages/procurement/FacilitiesWorkflow';
import SupplierList from './pages/suppliers/SupplierList';
import SupplierDetail from './pages/suppliers/SupplierDetail';
import PurchaseOrderList from './pages/orders/PurchaseOrderList';
import PurchaseOrderDetail from './pages/orders/PurchaseOrderDetail';
import GoodsReceiptList from './pages/grn/GoodsReceiptList';
import InvoiceVerification from './pages/finance/InvoiceVerification';
import PaymentProcessing from './pages/finance/PaymentProcessing';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import CategoryManagement from './pages/admin/CategoryManagement';
import ApprovalRulesPage from './pages/admin/ApprovalRulesPage';
import AuditLogs from './pages/admin/AuditLogs';
import './styles/global.css';
import './styles/components.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardRouter />} />
            
            {/* Requests */}
            <Route path="requests" element={<RequestList />} />
            <Route path="requests/create" element={<CreateRequest />} />
            <Route path="requests/:id" element={<RequestDetail />} />
            
            {/* Approvals */}
            <Route path="approvals" element={<ApprovalQueue />} />
            
            {/* Procurement */}
            <Route path="procurement" element={<ProcurementQueue />} />
            <Route path="procurement/equipment" element={<EquipmentWorkflow />} />
            <Route path="procurement/software" element={<SoftwareWorkflow />} />
            <Route path="procurement/facilities" element={<FacilitiesWorkflow />} />
            
            {/* Suppliers */}
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/:id" element={<SupplierDetail />} />
            
            {/* Purchase Orders */}
            <Route path="purchase-orders" element={<PurchaseOrderList />} />
            <Route path="purchase-orders/:id" element={<PurchaseOrderDetail />} />
            
            {/* GRN */}
            <Route path="grn" element={<GoodsReceiptList />} />
            
            {/* Finance */}
            <Route path="finance" element={<InvoiceVerification />} />
            <Route path="finance/payments" element={<PaymentProcessing />} />
            
            {/* Admin */}
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/roles" element={<RoleManagement />} />
            <Route path="admin/departments" element={<DepartmentManagement />} />
            <Route path="admin/categories" element={<CategoryManagement />} />
            <Route path="admin/approval-rules" element={<ApprovalRulesPage />} />
            <Route path="admin/audit-logs" element={<AuditLogs />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
