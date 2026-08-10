import { useAuth } from '../../contexts/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';
import ManagerDashboard from './ManagerDashboard';
import SeniorManagerDashboard from './SeniorManagerDashboard';
import HeadDashboard from './HeadDashboard';
import ProcurementDashboard from './ProcurementDashboard';
import FinanceDashboard from './FinanceDashboard';
import AdminDashboard from './AdminDashboard';
import SupplierPortal from '../suppliers/SupplierPortal';

const DashboardRouter = () => {
  const { currentUser } = useAuth();

  const dashboardMap = {
    employee: EmployeeDashboard,
    manager: ManagerDashboard,
    senior_manager: SeniorManagerDashboard,
    head: HeadDashboard,
    procurement_officer: ProcurementDashboard,
    equipment_team: ProcurementDashboard,
    software_team: ProcurementDashboard,
    facilities_team: ProcurementDashboard,
    finance_officer: FinanceDashboard,
    supplier: SupplierPortal,
    admin: AdminDashboard,
  };

  const Dashboard = dashboardMap[currentUser?.role] || EmployeeDashboard;
  return <Dashboard />;
};

export default DashboardRouter;
