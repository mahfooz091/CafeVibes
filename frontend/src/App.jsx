import { Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CustomersPage from './pages/CustomersPage';
import OrdersPage from './pages/OrdersPage';
import ReportsPage from './pages/ReportsPage';
import POSPage from './pages/POSPage';
import KitchenDisplayPage from './pages/KitchenDisplayPage';

import DashboardLayout from './layouts/DashboardLayout';
import POSLayout from './layouts/POSLayout';

import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/kitchen-display" element={<KitchenDisplayPage />} />

      {/* Admin routes */}
      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Employee routes */}
      <Route element={<ProtectedRoute roles={['employee', 'admin']} />}>
        <Route element={<POSLayout />}>
          <Route path="/pos" element={<POSPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
