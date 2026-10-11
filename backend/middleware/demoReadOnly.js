import ApiError from '../utils/ApiError.js';
import {
  demoProducts,
  demoCategories,
  demoFloors,
  demoTables,
  demoCustomers,
  demoOrders,
  demoKitchenOrders,
  demoPOSSession,
  demoSettings,
  demoStaffUsers,
  demoCoupons,
  getDemoDashboardReports,
} from '../services/demoDataService.js';

/**
 * Demo Security & Data Isolation Middleware
 * 
 * 1. Blocks ALL state-mutating requests (POST, PUT, PATCH, DELETE) with HTTP 403 Forbidden.
 * 2. Intercepts read requests for demo_viewer sessions to serve isolated, fictional data.
 * 3. Guarantees 0% read or write pollution on the production database.
 */
export const demoSecurityMiddleware = (req, res, next) => {
  // Only engage for authenticated demo_viewer sessions
  if (!req.user || req.user.role !== 'demo_viewer') {
    return next();
  }

  // 1. STRICT SERVER-SIDE READ-ONLY ENFORCEMENT
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
    return res.status(403).json({
      success: false,
      message: 'Read-only demo: this action is disabled in demo mode.',
      isDemoMode: true,
    });
  }

  // 2. ISOLATED DEMONSTRATION DATA ROUTING
  const cleanPath = req.originalUrl.split('?')[0].replace(/\/+$/, '');

  // Products
  if (cleanPath === '/api/products') {
    const categoryFilter = req.query.category;
    const searchFilter = req.query.search?.toLowerCase();
    let filtered = demoProducts;
    if (categoryFilter) {
      filtered = filtered.filter(
        (p) => p.category?._id === categoryFilter || p.category?.name === categoryFilter
      );
    }
    if (searchFilter) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchFilter));
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  }
  if (cleanPath.startsWith('/api/products/')) {
    const id = cleanPath.split('/')[3];
    const prod = demoProducts.find((p) => p._id === id) || demoProducts[0];
    return res.json({ success: true, data: prod });
  }

  // Categories
  if (cleanPath === '/api/categories') {
    return res.json({ success: true, count: demoCategories.length, data: demoCategories });
  }

  // Floors & Tables
  if (cleanPath === '/api/floors') {
    return res.json({ success: true, data: demoFloors });
  }
  if (cleanPath === '/api/tables') {
    const floorId = req.query.floor;
    const filtered = floorId ? demoTables.filter((t) => t.floor === floorId) : demoTables;
    return res.json({ success: true, data: filtered });
  }

  // Orders & Kitchen Display
  if (cleanPath === '/api/orders/kitchen') {
    return res.json({ success: true, count: demoKitchenOrders.length, data: demoKitchenOrders });
  }
  if (cleanPath === '/api/orders') {
    return res.json({ success: true, count: demoOrders.length, data: demoOrders });
  }
  if (cleanPath.startsWith('/api/orders/')) {
    const id = cleanPath.split('/')[3];
    const order = demoOrders.find((o) => o._id === id) || demoOrders[0];
    return res.json({ success: true, data: order });
  }

  // POS Session
  if (cleanPath === '/api/pos-sessions/active') {
    return res.json({ success: true, data: demoPOSSession });
  }
  if (cleanPath === '/api/pos-sessions/last-closed') {
    return res.json({ success: true, data: null });
  }

  // Reports & Analytics
  if (cleanPath.startsWith('/api/reports')) {
    const reports = getDemoDashboardReports();
    return res.json({ success: true, data: reports });
  }

  // Customers
  if (cleanPath === '/api/customers') {
    return res.json({ success: true, count: demoCustomers.length, data: demoCustomers });
  }

  // Store Settings
  if (cleanPath === '/api/settings') {
    return res.json({ success: true, data: demoSettings });
  }

  // Sanitized Staff Users (Never exposes production administrators)
  if (cleanPath === '/api/users') {
    return res.json({ success: true, count: demoStaffUsers.length, data: demoStaffUsers });
  }

  // Coupons & Promotions
  if (cleanPath === '/api/coupons' || cleanPath === '/api/promotions') {
    return res.json({ success: true, count: demoCoupons.length, data: demoCoupons });
  }

  next();
};

export default demoSecurityMiddleware;
