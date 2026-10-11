import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './ProtectedRoute';

import LandingPage from '../pages/LandingPage';
import DemoSelect from '../pages/DemoSelect';
import CustomerDemo from '../pages/CustomerDemo';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import Categories from '../pages/Categories';
import Customers from '../pages/Customers';
import Orders from '../pages/Orders';
import Reports from '../pages/Reports';
import POS from '../pages/POS';
import KitchenDisplay from '../pages/KitchenDisplay';
import FloorsTables from '../pages/FloorsTables';
import Coupons from '../pages/Coupons';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';

const AppRoutes = () => (
  <Routes>
    {/* Public & Customer Exploration Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/demo" element={<DemoSelect />} />
    <Route path="/customer-demo" element={<CustomerDemo />} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/auth/callback" element={<AuthCallback />} />

    {/* Protected Administrative & Operations Routes */}
    <Route path="/dashboard" element={<ProtectedRoute roles={['admin']}><Dashboard /></ProtectedRoute>} />
    <Route path="/products" element={<ProtectedRoute roles={['admin']}><Products /></ProtectedRoute>} />
    <Route path="/categories" element={<ProtectedRoute roles={['admin']}><Categories /></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
    <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
    <Route path="/floors" element={<ProtectedRoute roles={['admin']}><FloorsTables /></ProtectedRoute>} />
    <Route path="/coupons" element={<ProtectedRoute roles={['admin']}><Coupons /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />

    <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
    <Route path="/kitchen" element={<ProtectedRoute><KitchenDisplay /></ProtectedRoute>} />

    {/* Application-level 404 Route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
